const mongoose = require('../service/mongooseService.js').mongoose;
const Promise = require('bluebird');

const Asset = mongoose.model('Asset');
const _ = require('lodash');
const moment = require('moment');

let baseUrl = _.get(process.env,'baseUrl', 'http://127.0.0.1:8080');

let assetDao = {};


assetDao.create = function (data) {
    try {
        let asset = new Asset(data);
        return asset.save();
    } catch (err) {
        return Promise.reject(err);
    }
};


assetDao.findOne = function (conditions, projection, options) {
    try {
        return Asset.findOne(conditions, projection, options).exec();
    } catch (err) {
        return Promise.reject(err);
    }
};

assetDao.find = function (conditions, projection, options) {
    try {
        return Asset.find(conditions, projection, options).exec();
    } catch (err) {
        return Promise.reject(err);
    }
};


assetDao.findOneAndUpdate = function (conditions, update, options) {
    try {
        if (_.isNil(options)) {
            options = {};
        }
        _.set(options, 'new', true);
        _.set(options, 'upsert', true);
        _.set(options, 'runValidators', true);

        return Asset.findOneAndUpdate(conditions, update, options).exec();

    } catch (err) {
        return Promise.reject(err);
    }
};

assetDao.aggregate = function (pipeline) {
    try {
        return Asset.aggregate(pipeline).exec();
    } catch (err) {
        return Promise.reject(err);
    }
};

assetDao.findOneAndDelete = function (conditions, options) {
    try {
        return Asset.findOneAndDelete(conditions, options).exec();
    } catch (err) {
        return Promise.reject(err);
    }
};


module.exports = assetDao;
