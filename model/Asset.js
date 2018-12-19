const Schema = require('mongoose').Schema;
const momentUtil = require('../util/momentUtil.js');
const moment = require('moment');
const _ = require('lodash');

let Asset = new Schema({
    name: {type: String, required: true},
    description: {type: String},
    type: {type: String, required: true, default: 'Contract'},
    supplier: {type: String, required: true},
    attributes: [{name: String, value: String}],
    owner: {type: String, required: true},
    renewalDate: {
        type: Date, validate: {
            validator: function (renewalDate) {
                if (_.isNil(renewalDate)) {
                    return true;
                }
                let asset = this;
                renewalDate = moment(renewalDate);
                return renewalDate.isValid() && moment(asset.expiryDate) > renewalDate;
            },
        }
    },
    expiryDate: {
        type: Date, required: true, validate: {
            validator: function (date) {
                return moment(date).isValid();
            },
        }
    },

    renewalReminders: {
        type: [
            {
                type: String,
                validate: {
                    validator: momentUtil.validateDuration,
                    message: function (props) {
                        console.log(arguments);
                        return `${props.value} is not a valid reminder duration.`
                    }
                }
            }
        ],
        default: ['3 months', '1 months', '1 weeks'],
    },

    expiryReminders: {
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
        default: ['3 months', '1 month', '1 week'],
    }
});

Asset.method('getUpdates', function (now) {
    let asset = this;

    let expiryDate = moment(asset.expiryDate);

    let updates = [];

    if (_.isNil(now) || expiryDate.isSame(now, 'day')) {
        let message = `Attention ${asset.owner}:\n${asset.type} ${asset.name} from ${asset.supplier} is expiring today!`;
        updates.push({
            date: expiryDate,
            message: message,
            type: 'asset_expiry_date'
        });
    }

    if (!_.isEmpty(asset.expiryReminders)) {
        _.each(asset.expiryReminders, function (reminder) {
            let duration = momentUtil.getDuration(reminder);
            let reminderDate = expiryDate.clone().subtract(duration);
            if (_.isNil(now) || reminderDate.isSame(now, 'day')) {
                let message = `Attention ${asset.owner}:\n${asset.type} ${asset.name} from ${asset.supplier} is expiring ${duration.humanize(true)}.`;
                updates.push({
                    reminderDate: reminderDate,
                    message: message,
                    type: 'asset_expiry_reminder'
                });
            }
        });
    }

    if (!_.isNil(asset.renewalDate)) {
        let renewalDate = moment(asset.renewalDate);

        if (_.isNil(now) || renewalDate.isSame(now, 'day')) {
            let message = `Attention ${asset.owner}:\n${asset.type} ${asset.name} from ${asset.supplier} is due for renewal today!`;
            updates.push({
                date: expiryDate,
                message: message,
                type: 'asset_expiry_date'
            });
        }


        if (!_.isEmpty(asset.renewalReminders)) {
            _.each(asset.renewalReminders, function (reminder) {
                let duration = momentUtil.getDuration(reminder);
                let reminderDate = renewalDate.clone().subtract(duration);
                if (_.isNil(now) || reminderDate.isSame(now, 'day')) {
                    let message = `Attention ${asset.owner}:\n${asset.type} ${asset.name} from ${asset.supplier} is due for renewal ${duration.humanize(true)}.`;
                    updates.push({
                        reminderDate: reminderDate,
                        message: message,
                        type: 'asset_renewal_reminder'
                    });
                }
            });
        }
    }


    return updates;
});


module.exports = Asset;
