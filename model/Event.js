const Schema = require('mongoose').Schema;
const momentUtil = require('../util/momentUtil.js');
const moment = require('moment');
const _ = require('lodash');

let Event = new Schema({
    name: {type: String, required: true},
    description: {type: String},
    startDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (startDate) {
                let status = this;
                startDate = moment(status.endDate);
                return startDate.isValid();
            },
        }
    },
    endDate: {
        type: Date,
        validate: {
            validator: function (endDate) {
                let status = this;
                endDate = moment(status.endDate);
                return endDate.isValid() && moment(status.startDate) < endDate;
            },
        }
    },
    location: {type: String},
    attendees: {type: String},
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
        default: ['1 weeks', '1 days'],
    },
});


Event.method('getUpdates', function (now) {
    let event = this;

    let startDate = moment(event.startDate);

    let updates = [];


    if (!_.isNil(event.endDate)) {
        let endDate = moment(event.endDate);

        if (_.isNil(now) || startDate.isSame(now, 'day') || now.isBetween(startDate, endDate)) {
            let remainingDuration = moment.duration(!_.isNil(now) ? now.diff(endDate) : startDate.diff(endDate));

            let message = `Today is ${event.name}, ending ${remainingDuration.humanize(true)}`;

            updates.push({
                date: startDate,
                endDate: endDate,
                message: message,
                type: 'event_date'
            });
        }

    } else {
        if (_.isNil(now) || startDate.isSame(now, 'day')) {

            let message = `Today is ${event.name}.`;

            updates.push({
                date: startDate,
                message: message,
                type: 'event_date'
            });

        }
    }


    if (!_.isEmpty(event.reminders)) {
        _.each(event.reminders, function (reminder) {
            let duration = momentUtil.getDuration(reminder);
            let reminderDate = startDate.clone().subtract(duration);
            if (_.isNil(now) || reminderDate.isSame(now, 'day')) {
                let message = `${event.name} is ${duration.humanize(true)}.`;
                updates.push({
                    reminderDate: reminderDate,
                    message: message,
                    type: 'event_reminder'
                });
            }
        });
    }

    return updates;
});


module.exports = Event;
