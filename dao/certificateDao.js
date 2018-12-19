const mongoose = require('../service/mongooseService.js').mongoose;

const moment = require('moment');
const Promise = require('bluebird');

const Certificate = mongoose.model('Certificate');
const _ = require('lodash');

let certificateDao = {};


certificateDao.create = function (data) {
    try {
        let certificate = new Certificate(data);
        return certificate.save();
    } catch (err) {
        return Promise.reject(err);
    }
};


certificateDao.findOne = function (conditions, projection, options) {
    try {
        return Certificate.findOne(conditions, projection, options).exec();
    } catch (err) {
        return Promise.reject(err);
    }
};

certificateDao.find = function (conditions, projection, options) {
    try {
        return Certificate.find(conditions, projection, options).exec();
    } catch (err) {
        return Promise.reject(err);
    }
};


certificateDao.findOneAndUpdate = function (conditions, update, options) {
    try {
        if (_.isNil(options)) {
            options = {};
        }
        _.set(options, 'new', true);
        _.set(options, 'upsert', true);
        _.set(options, 'runValidators', true);

        return Certificate.findOneAndUpdate(conditions, update, options).exec();

    } catch (err) {
        return Promise.reject(err);
    }
};


certificateDao.aggregate = function (pipeline) {
    try {
        return Certificate.aggregate(pipeline).exec();
    } catch (err) {
        return Promise.reject(err);
    }
};

certificateDao.findOneAndDelete = function (conditions, options) {
    try {
        return Certificate.findOneAndDelete(conditions, options).exec();
    } catch (err) {
        return Promise.reject(err);
    }
};

module.exports = certificateDao;
