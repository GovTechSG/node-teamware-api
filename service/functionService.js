const cron = require("cron");
const CronJob = cron.CronJob;
const vm2 = require('vm2');
const NodeVM = vm2.NodeVM;
const VMScript = vm2.VMScript;
const EventEmitter = require('events');


const Promise = require('bluebird');

const _ = require('lodash');
const _path = require('path');
const logger = require('../service/loggerService.js');
const functionDao = require('../dao/functionDao.js');
const functionStorageDao = require('../dao/functionStorageDao.js');


let functionService = {};

functionService.events = new EventEmitter();

functionService.init = function () {
    return functionDao.find()
        .then(function (functions) {
            return Promise.map(functions, function (_function) {
                return functionService.addFunction(_function);
            });
        })
};


functionService.functions = {};

functionService.functionNames = {};
functionService.commandToFunctionsIndex = {};


functionService.addFunction = function (_function) {
    if (_.isArray(_function)) {
        return _.map(_function, functionService.addFunction);
    }

    let functionId = _function._id;
    let functionName = _function.name;

    functionService.deleteFunction(functionId);

    let functionEntry = {
        function: _function,
    };


    if (_function.active) {
        try {
            let script = new VMScript(_function.code);
            _.set(functionEntry, 'script', script);

        } catch (err) {
            logger.error('Could not create script for Function [' + functionId + '] ' + functionName + '.');
        }

        if (!_.isEmpty(_function.cron)) {
            try {
                functionEntry.cron = new CronJob(_function.cron, function () {
                    try {
                        return functionService.runFunction({id: functionId, invocation: `cron ${_function.cron}`})
                            .tap(function (results) {
                                return functionService.events.emit('cron', {id: functionId, results: results});
                            });
                    } catch (err) {
                        logger.error(`Error in Cron job for function ${functionId}: ${functionName}: ${err.stack}`);
                    }
                }, null, true);
            } catch (err) {
                logger.error(`Could not create Cron job for Function [${functionId}] ${functionName}: ${err.stack}`);
            }
        }
    }

    _.set(functionService.functions, functionId, functionEntry);
    _.set(functionService.functionNames, functionName, functionId.toString());


};

functionService.getFunction = function (functionId) {
    return _.get(functionService.functions, functionId);
};

functionService.getFunctionByName = function (functionName) {
    return _.get(functionService.functions, _.get(functionService.functionNames, functionName));
};


functionService.deleteFunction = function (functionId) {
    if (_.isArray(functionId)) {
        return _.map(functionId, functionService.deleteFunction);
    }

    let functionEntry = functionService.getFunction(functionId);
    if (_.isNil(functionEntry)) {
        return;
    }
    if (!_.isNil(functionEntry.cron)) {
        functionEntry.cron.stop();
    }

    _.unset(functionService.functions, functionId);
    _.remove(functionService.functionNames, function (_id) {
        return _id === functionId;
    });
};


functionService._newVm = function (options) {
    if (_.isNil(options)) {
        options = {};
    }
    _.set(options, 'console', 'redirect');

    _.set(options, 'require.builtin', [
        'crypto',
        'url',
        'stream',
        'path',
        'util',
        'events',
        'dns'
    ]);
    _.set(options, 'require.root', _path.resolve(process.cwd(), 'sandbox'));
    _.set(options, 'require.external', ['lodash',
        'bluebird',
        'moment',
        'superagent',
        'cheerio']);
    _.set(options, 'require.wrapper', 'commonjs');

    _.each(functionService.functionNames, function (functionId, functionName) {
        _.set(options, ['sandbox', functionName], function () {
            functionService.runFunction(functionId, _.toArray(arguments));
        });
    });

    return new NodeVM(options);

};

functionService.runFunction = function () {
    try {
        let args = _.toArray(arguments);
        let functionId;
        let invocation = null;
        let firstArg = _.first(args);
        if (_.isPlainObject(firstArg)) {
            functionId = _.get(firstArg, 'id');
            invocation = _.get(firstArg, 'invocation');
        } else {
            functionId = firstArg;
        }

        args = args.slice(1);

        let functionEntry = functionService.getFunction(functionId);

        if (_.isNil(functionEntry) || !_.get(functionEntry, 'function.active')) {
            return Promise.resolve();
        }

        let functionName = functionEntry.function.name;

        let logMetadata = {function: {id: functionId, name: functionName}};
        if (!_.isNil(invocation)) {
            _.set(logMetadata, 'invocation', invocation);
        }

        if (!_.isEmpty(args)) {
            _.set(logMetadata, 'args', args);
        }

        let scriptPath = _path.resolve(process.cwd(), 'sandbox', functionName + '.js');
        let vm = functionService._newVm();

        _.each(['log', 'info', 'warn', 'error'], function (level) {
            vm.on('console.' + level, function (message) {
                if (level === 'log') {
                    level = 'info';
                }

                logger.log(_.extend({}, logMetadata, {level: level, message: message}));
            });
        });


        let storage = {};
        storage.create = function (data) {
            _.set(data, 'function', functionId);
            return functionStorageDao.create(data);
        };

        storage.findOne = function (conditions, projection, options) {
            _.set(conditions, 'function', functionId);
            return functionStorageDao.findOne(conditions, projection, options);
        };

        storage.find = function (conditions, projection, options) {
            _.set(conditions, 'function', functionId);
            return functionStorageDao.find(conditions, projection, options);
        };

        storage.findOneAndUpdate = function (conditions, update, options) {
            _.set(conditions, 'function', functionId);
            return functionStorageDao.findOneAndUpdate(conditions, update, options);
        };
        storage.findOneAndDelete = function (conditions, options) {
            _.set(conditions, 'function', functionId);
            return functionStorageDao.findOneAndDelete(conditions, update, options);
        };

        vm.freeze(storage, 'storage');

        let script = vm.run(functionEntry.script, scriptPath);

        logger.log(_.extend({}, logMetadata, {
            level: 'info',
            message: 'Running function [' + functionId + '] ' + functionName + '()'
        }));

        return Promise.resolve(script.apply(functionEntry, args))
            .timeout(3000)
            .tap(function () {
                logger.log(_.extend({}, logMetadata, {
                    level: 'info',
                    message: 'Finished function [' + functionId + '] ' + functionName + '()'
                }));
            });

    } catch (err) {
        return Promise.reject(err);
    }

};


module.exports = functionService;
