const Schema = require('mongoose').Schema;
const moment = require('moment');
const _ = require('lodash');

let TelegramChat = new Schema({
    chatId: {type: Number, required: true, unique: true},
    type: {type: String, required: true},
    title: {type: String},
    username: {type: String},
    firstName: {type: String},
    lastName: {type: String}
});

module.exports = TelegramChat;
