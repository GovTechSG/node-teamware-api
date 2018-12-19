const mongoose = require('../service/mongooseService.js').mongoose;

const Promise = require('bluebird');

const Status = mongoose.model('Status');
const _ = require('lodash');

let statusDao = {};


statusDao.create = function (data) {
    try {
        let status = new Status(data);
        return status.save();
    } catch (err) {
        return Promise.reject(err);
    }
};


statusDao.findOne = function (conditions, projection, options) {
    try {
        return Status.findOne(conditions, projection, options).exec();
    } catch (err) {
        return Promise.reject(err);
    }
};

statusDao.find = function (conditions, projection, options) {
    try {
        return Status.find(conditions, projection, options).exec();
    } catch (err) {
        return Promise.reject(err);
    }
};


statusDao.findOneAndUpdate = function (conditions, update, options) {
    try {
        if (_.isNil(options)) {
            options = {};
        }
        _.set(options, 'new', true);
        _.set(options, 'upsert', true);
        _.set(options, 'runValidators', true);

        return Status.findOneAndUpdate(conditions, update, options).exec();

    } catch (err) {
        return Promise.reject(err);
    }
};


statusDao.aggregate = function (pipeline) {
    try {
        return Status.aggregate(pipeline).exec();
    } catch (err) {
        return Promise.reject(err);
    }
};
statusDao.findOneAndDelete = function (conditions, options) {
    try {
        return Status.findOneAndDelete(conditions, options).exec();
    } catch (err) {
        return Promise.reject(err);
    }
};

module.exports = statusDao;
