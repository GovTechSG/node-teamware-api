const mongoose = require('../service/mongooseService.js').mongoose;

const Promise = require('bluebird');

const FunctionStorage = mongoose.model('FunctionStorage');

const _ = require('lodash');

let functionStorageDao = {};


functionStorageDao.create = function (data) {
    try {
        let _function = new FunctionStorage(data);
        return _function.save();
    } catch (err) {
        return Promise.reject(err);
    }
};


functionStorageDao.findOne = function (conditions, projection, options) {
    try {
        return FunctionStorage.findOne(conditions, projection, options).exec();
    } catch (err) {
        return Promise.reject(err);
    }
};

functionStorageDao.find = function (conditions, projection, options) {
    try {
        return FunctionStorage.find(conditions, projection, options).exec();
    } catch (err) {
        return Promise.reject(err);
    }
};


functionStorageDao.findOneAndUpdate = function (conditions, update, options) {
    try {
        if (_.isNil(options)) {
            options = {};
        }
        _.set(options, 'new', true);
        _.set(options, 'upsert', true);
        _.set(options, 'runValidators', true);

        return FunctionStorage.findOneAndUpdate(conditions, update, options).exec();
    } catch (err) {
        return Promise.reject(err);
    }
};


functionStorageDao.aggregate = function (pipeline) {
    try {
        return FunctionStorage.aggregate(pipeline).exec();
    } catch (err) {
        return Promise.reject(err);
    }
};
functionStorageDao.findOneAndDelete = function (conditions, options) {
    try {
        return FunctionStorage.findOneAndDelete(conditions, options).exec();

    } catch (err) {
        return Promise.reject(err);
    }
};


module.exports = functionStorageDao;
