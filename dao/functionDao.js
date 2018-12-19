const mongoose = require('../service/mongooseService.js').mongoose;

const Promise = require('bluebird');

const Function = mongoose.model('Function');

const _ = require('lodash');

let functionDao = {};


functionDao.create = function (data) {
    try {
        let _function = new Function(data);
        return _function.save();
    } catch (err) {
        return Promise.reject(err);
    }
};


functionDao.findOne = function (conditions, projection, options) {
    try {
        return Function.findOne(conditions, projection, options).exec();
    } catch (err) {
        return Promise.reject(err);
    }
};

functionDao.find = function (conditions, projection, options) {
    try {
        return Function.find(conditions, projection, options).exec();
    } catch (err) {
        return Promise.reject(err);
    }
};


functionDao.findOneAndUpdate = function (conditions, update, options) {
    try {
        if (_.isNil(options)) {
            options = {};
        }
        _.set(options, 'new', true);
        _.set(options, 'upsert', true);
        _.set(options, 'runValidators', true);

        return Function.findOneAndUpdate(conditions, update, options).exec();

    } catch (err) {
        return Promise.reject(err);
    }
};


functionDao.aggregate = function (pipeline) {
    try {
        return Function.aggregate(pipeline).exec();
    } catch (err) {
        return Promise.reject(err);
    }
};
functionDao.findOneAndDelete = function (conditions, options) {
    try {
        return Function.findOneAndDelete(conditions, options).exec();

    } catch (err) {
        return Promise.reject(err);
    }
};


module.exports = functionDao;
