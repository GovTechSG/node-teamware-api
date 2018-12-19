const Schema = require('mongoose').Schema;
const momentUtil = require('../util/momentUtil.js');
const moment = require('moment');
const _ = require('lodash');

let Status = new Schema({
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
    }
});

Status.method('getUpdates', function (now) {
    let status = this;

    let startDate = moment(status.startDate);

    let updates = [];


    if (!_.isNil(status.endDate)) {
        let endDate = moment(status.endDate);

        if (_.isNil(now) || startDate.isSame(now, 'day') || now.isBetween(startDate, endDate)) {
            let remainingDuration = moment.duration(!_.isNil(now) ? now.diff(endDate) : startDate.diff(endDate));

            let message = `${status.name} is ${status.description}, ending ${remainingDuration.humanize(true)}`;

            updates.push({
                date: startDate,
                endDate: endDate,
                message: message,
                type: 'status_date'
            });
        }

    } else {
        if (_.isNil(now) || startDate.isSame(now, 'day')) {

            let message = `${status.name} is ${status.description}`;

            updates.push({
                date: startDate,
                message: message,
                type: 'status_date'
            });

        }
    }


    if (!_.isEmpty(status.reminders)) {
        _.each(status.reminders, function (reminder) {
            let duration = momentUtil.getDuration(reminder);
            let reminderDate = startDate.clone().subtract(duration);
            if (_.isNil(now) || reminderDate.isSame(now, 'day')) {
                let message = `${status.name} is ${status.description} ${duration.humanize(true)}.`;
                updates.push({
                    reminderDate: reminderDate,
                    message: message,
                    type: 'status_reminder'
                });
            }
        });
    }

    return updates;
});


module.exports = Status;
