const mongoose = require('../service/mongooseService.js').mongoose;

const Promise = require('bluebird');

const User = mongoose.model('User');
const _ = require('lodash');

let userDao = {};


userDao.create = function (data) {
    try {
        let user = new User(data);
        return user.save();
    } catch (err) {
        return Promise.reject(err);
    }
};


userDao.findOne = function (conditions, projection, options) {
    try {
        return User.findOne(conditions, projection, options).exec();
    } catch (err) {
        return Promise.reject(err);
    }
};

userDao.find = function (conditions, projection, options) {
    try {
        return User.find(conditions, projection, options).exec();
    } catch (err) {
        return Promise.reject(err);
    }
};


userDao.findOneAndUpdate = function (conditions, update, options) {
    try {
        if (_.isNil(options)) {
            options = {};
        }
        _.set(options, 'new', true);
        _.set(options, 'upsert', true);
        _.set(options, 'runValidators', true);

        return User.findOneAndUpdate(conditions, update, options).exec()

    } catch (err) {
        return Promise.reject(err);
    }
};


userDao.aggregate = function (pipeline) {
    try {
        return User.aggregate(pipeline).exec();
    } catch (err) {
        return Promise.reject(err);
    }
};

userDao.findOneAndDelete = function (conditions, options) {
    try {
        return User.findOneAndDelete(conditions, options).exec();
    } catch (err) {
        return Promise.reject(err);
    }
};


module.exports = userDao;
