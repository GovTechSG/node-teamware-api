const mongoose = require('../service/mongooseService.js').mongoose;
const Promise = require('bluebird');

const Anniversary = mongoose.model('Anniversary');
const _ = require('lodash');
const moment = require('moment');
const logger = require('../service/loggerService');

let anniversaryDao = {};


anniversaryDao.create = function (data) {
    try {
        let anniversary = new Anniversary(data);
        return anniversary.save();
    } catch (err) {
        return Promise.reject(err);
    }
};


anniversaryDao.findOne = function (conditions, projection, options) {
    try {
        return Anniversary.findOne(conditions, projection, options).exec();
    } catch (err) {
        return Promise.reject(err);
    }
};

anniversaryDao.find = function (conditions, projection, options) {
    try {
        return Anniversary.find(conditions, projection, options).exec();
    } catch (err) {
        return Promise.reject(err);
    }
};


anniversaryDao.aggregate = function (pipeline) {
    try {
        return Anniversary.aggregate(pipeline).exec();
    } catch (err) {
        return Promise.reject(err);
    }
};


anniversaryDao.findOneAndUpdate = function (conditions, update, options) {
    try {
        if (_.isNil(options)) {
            options = {};
        }
        _.set(options, 'new', true);
        _.set(options, 'upsert', true);
        _.set(options, 'runValidators', true);

        return Anniversary.findOneAndUpdate(conditions, update, options).exec()

    } catch (err) {
        return Promise.reject(err);
    }
};


anniversaryDao.findOneAndDelete = function (conditions, options) {
    try {
        return Anniversary.findOneAndDelete(conditions, options).exec();
    } catch (err) {
        return Promise.reject(err);
    }
};



module.exports = anniversaryDao;
