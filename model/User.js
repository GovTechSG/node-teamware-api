const Schema = require('mongoose').Schema;
const moment = require('moment');
const _ = require('lodash');


let User = new Schema({
    username: {type: String, required: true, unique: true},
    passwordHash: {type: String, required: true},
    name: {type: String, required: true},
    telegramId: {type: String}
});

module.exports = User;
