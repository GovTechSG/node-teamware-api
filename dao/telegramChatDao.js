const mongoose = require('../service/mongooseService.js').mongoose;
const Promise = require('bluebird');

const TelegramChat = mongoose.model('TelegramChat');
const _ = require('lodash');

let telegramChatDao = {};


telegramChatDao.create = function (data) {
    try {
        let telegramChat = new TelegramChat(data);
        return telegramChat.save();
    } catch (err) {
        return Promise.reject(err);
    }
};


telegramChatDao.findOne = function (conditions, projection, options) {
    try {
        return TelegramChat.findOne(conditions, projection, options).exec();
    } catch (err) {
        return Promise.reject(err);
    }
};

telegramChatDao.find = function (conditions, projection, options) {
    try {
        return TelegramChat.find(conditions, projection, options).exec();
    } catch (err) {
        return Promise.reject(err);
    }
};


telegramChatDao.aggregate = function (pipeline) {
    try {
        return TelegramChat.aggregate(pipeline).exec();
    } catch (err) {
        return Promise.reject(err);
    }
};


telegramChatDao.findOneAndUpdate = function (conditions, update, options) {
    try {
        if (_.isNil(options)) {
            options = {};
        }
        _.set(options, 'new', true);
        _.set(options, 'upsert', true);
        _.set(options, 'runValidators', true);

        return TelegramChat.findOneAndUpdate(conditions, update, options).exec()

    } catch (err) {
        return Promise.reject(err);
    }
};


telegramChatDao.findOneAndDelete = function (conditions, options) {
    try {
        return TelegramChat.findOneAndDelete(conditions, options).exec();
    } catch (err) {
        return Promise.reject(err);
    }
};


module.exports = telegramChatDao;
