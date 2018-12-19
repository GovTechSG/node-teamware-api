const mongoose = require('../service/mongooseService.js').mongoose;

const Promise = require('bluebird');

const Chat = mongoose.model('TelegramChat');
const _ = require('lodash');

let chatDao = {};


chatDao.create = function (data) {
    try {
        let chat = new Chat(data);
        return chat.save();
    } catch (err) {
        return Promise.reject(err);
    }
};


chatDao.findOne = function (conditions, projection, options) {
    try {
        return Chat.findOne(conditions, projection, options).exec();
    } catch (err) {
        return Promise.reject(err);
    }
};

chatDao.find = function (conditions, projection, options) {
    try {
        return Chat.find(conditions, projection, options).exec();
    } catch (err) {
        return Promise.reject(err);
    }
};


chatDao.findOneAndUpdate = function (conditions, update, options) {
    try {
        if (_.isNil(options)) {
            options = {};
        }
        _.set(options, 'new', true);
        _.set(options, 'upsert', true);
        _.set(options, 'runValidators', true);

        return Chat.findOneAndUpdate(conditions, update, options).exec()

    } catch (err) {
        return Promise.reject(err);
    }
};


chatDao.aggregate = function (pipeline) {
    try {
        return Chat.aggregate(pipeline).exec();
    } catch (err) {
        return Promise.reject(err);
    }
};

chatDao.findOneAndDelete = function (conditions, options) {
    try {
        return Chat.findOneAndDelete(conditions, options).exec();
    } catch (err) {
        return Promise.reject(err);
    }
};


module.exports = chatDao;
