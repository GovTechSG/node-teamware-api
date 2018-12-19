const Schema = require('mongoose').Schema;
const momentUtil = require('../util/momentUtil.js');
const moment = require('moment');
const _ = require('lodash');

let Anniversary = new Schema({
    name: {type: String, required: true},
    description: {type: String},
    event: {type: String, required: true, default: 'Birthday'},
    date: {
        type: Date, required: true, validate: {
            validator: function (date) {
                return moment(date).isValid();
            },
        }
    },
    reminders: {
        type: [
            {
                type: String, validate: {
                    validator: momentUtil.validateDuration,
                    message: function (props) {
                        return `${props.value} is not a valid reminder duration.`
                    }
                }
            }
        ],
        default: [],
    }
});


Anniversary.method('getUpdates', function (now) {
    let year = moment().year();
    let anniversary = this;

    let date = moment(anniversary.date).year(year);

    let updates = [];

    if (_.isNil(now) || date.isSame(now, 'day')) {
        let message = `Happy ${anniversary.event}, ${anniversary.name}!`;
        updates.push({
            date: date,
            message: message,
            type: 'anniversary_date'
        });
    }


    if (!_.isEmpty(anniversary.reminders)) {
        _.each(anniversary.reminders, function (reminder) {
            let duration = momentUtil.getDuration(reminder);
            let reminderDate = date.clone().subtract(duration);
            if (_.isNil(now) || reminderDate.isSame(now, 'day')) {
                let message = `${this.name}'s ${this.event} is ${duration.humanize(true)}`;
                updates.push({
                    reminderDate: reminderDate,
                    message: message,
                    type: 'anniversary_reminder'
                });
            }
        });
    }

    return updates;
});


module.exports = Anniversary;
