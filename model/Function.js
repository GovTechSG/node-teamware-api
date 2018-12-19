const Schema = require('mongoose').Schema;
const CronTime = require('cron').CronTime;
const moment = require('moment');
const _ = require('lodash');

let Function = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (command) {
                return /^[$a-z_][0-9a-z_$]*$/.test(command);
            }
        }
    },
    description: {type: String},
    code: {type: String, required: true},
    active: {type: Boolean, required: true, default: false},
    cron: {
        type: String,
        validate: {
            validator: function (data) {
                try {
                    new CronTime(data);
                    return true;
                } catch (err) {
                    return false;
                }
            },
            message: function (props) {
                return `${props.value} is not a valid cron expression.`
            }
        }
    },

});

module.exports = Function;
