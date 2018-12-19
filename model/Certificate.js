const Schema = require('mongoose').Schema;
const momentUtil = require('../util/momentUtil.js');
const moment = require('moment');
const _ = require('lodash');

let Certificate = new Schema({
    name: {type: String, required: true},
    description: {type: String},
    subject: {type: String, required: true},
    issuer: {type: String, required: true},
    notBefore: {
        type: Date, required: true, validate: {
            validator: function (date) {
                return moment(date).isValid();
            },
        }
    },
    notAfter: {
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
        default: ['3 months', '1 months', '1 weeks']
    },
    pem: {type: String},
    owner: {type: String, required: true}
});



Certificate.method('getUpdates', function (now) {
    let certificate = this;

    let notAfter = moment(certificate.notAfter);

    let updates = [];

    if (_.isNil(now) || notAfter.isSame(now, 'day')) {
        let message = `Attention ${certificate.owner}:\n${certificate.type} ${certificate.name} from ${certificate.supplier} is expiring today!`;
        updates.push({
            date: notAfter,
            message: message,
            type: 'certificate_date'
        });
    }

    if (!_.isEmpty(certificate.expiryReminders)) {
        _.each(certificate.expiryReminders, function (reminder) {
            let duration = momentUtil.getDuration(reminder);
            let reminderDate = notAfter.clone().subtract(duration);
            if (_.isNil(now) || reminderDate.isSame(now, 'day')) {
                let message = `Attention ${certificate.owner}:\n${certificate.type} ${certificate.name} from ${certificate.supplier} is expiring ${duration.humanize(true)}.`;
                updates.push({
                    reminderDate: reminderDate,
                    message: message,
                    type: 'certificate_reminder'
                });
            }
        });
    }

    return updates;
});


module.exports = Certificate;
