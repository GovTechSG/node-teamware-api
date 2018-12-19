const mongoose = require('mongoose');

const models = require('../model/index.js');
const _ = require('lodash');
let mongooseService = {};

mongoose.Promise = require('bluebird');

mongooseService.mongoose = mongoose;


mongooseService.connect = function (options) {
    let uri;
    if (_.isString(options)) {
        uri = options;
        options = {};
    } else {
        let hostname = _.get(options, 'hostname', _.get(process.env, 'MONGODB_HOSTNAME', 'localhost'));
        let port = _.get(options, 'port', _.get(process.env, 'MONGODB_PORT', 27017));
        let database = _.get(options, 'database', _.get(process.env, 'MONGODB_DATABASE', 'teamware-api'));
        let username = _.get(options, 'username', _.get(process.env, 'MONGODB_USERNAME'));
        let password = _.get(options, 'password', _.get(process.env, 'MONGODB_PASSWORD'));

        uri = 'mongodb://';
        if (!_.isEmpty(username) && !_.isEmpty(password)) {
            uri += username + ':' + password + '@';
        }
        uri += hostname + ':' + port;
        if (!_.isEmpty(database)) {
            uri += '/' + database;
        }

        options = _.omit(options, ['hostname', 'port', 'database', 'username', 'password']);
    }

    if (_.isNil(options)) {
        options = {};
    }
    options.useNewUrlParser = true;

    return mongoose.connect(uri, options);
};

_.each(models, function (model, modelName) {
    mongoose.model(modelName, model);
});

module.exports = mongooseService;
