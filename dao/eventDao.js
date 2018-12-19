const mongoose = require('../service/mongooseService.js').mongoose;

const Promise = require('bluebird');

const Event = mongoose.model('Event');
const _ = require('lodash');

let eventDao = {};


eventDao.create = function (data) {
    try {
        let event = new Event(data);
        return event.save();
    } catch (err) {
        return Promise.reject(err);
    }
};


eventDao.findOne = function (conditions, projection, options) {
    try {
        return Event.findOne(conditions, projection, options).exec();
    } catch (err) {
        return Promise.reject(err);
    }
};

eventDao.find = function (conditions, projection, options) {
    try {
        return Event.find(conditions, projection, options).exec();
    } catch (err) {
        return Promise.reject(err);
    }
};


eventDao.findOneAndUpdate = function (conditions, update, options) {
    try {
        if (_.isNil(options)) {
            options = {};
        }
        _.set(options, 'new', true);
        _.set(options, 'upsert', true);
        _.set(options, 'runValidators', true);

        return Event.findOneAndUpdate(conditions, update, options).exec();

    } catch (err) {
        return Promise.reject(err);
    }
};


eventDao.aggregate = function (pipeline) {
    try {
        return Event.aggregate(pipeline).exec();
    } catch (err) {
        return Promise.reject(err);
    }
};
eventDao.findOneAndDelete = function (conditions, options) {
    try {
        return Event.findOneAndDelete(conditions, options).exec();
    } catch (err) {
        return Promise.reject(err);
    }
};

module.exports = eventDao;
