const cron = require("cron");
const CronJob = cron.CronJob;
const vm2 = require('vm2');
const NodeVM = vm2.NodeVM;
const VMScript = vm2.VMScript;

const Promise = require('bluebird');

const _ = require('lodash');
const logger = require('../service/loggerService.js');


let functionUtil = {};
functionUtil.newVm = function () {
    return new NodeVM({
        require: {
            builtin: [
                'crypto',
                'url',
                'stream',
                'path',
                'util',
                'events',
                'dns'
            ],
            external: [
                'lodash',
                'bluebird',
                'moment',
                'superagent',
                'cheerio'
            ]
        }
    })
};

functionUtil.newScript = function (code) {
    return new VMScript(code);
};


functionUtil.run = function (code) {
    try {
        return Promise.resolve(functionUtil.newVm().run(code));
    } catch (err) {
        return Promise.reject(err);
    }
};


module.exports = functionUtil;
