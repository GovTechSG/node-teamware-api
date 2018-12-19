const moment = require('moment');
const _ = require('lodash');
let momentUtil = {};

momentUtil.durationRegex = /^(\d+) (seconds|minutes|hours|days|weeks|months|years)$/;

momentUtil.getDuration = function (string) {
    let match = momentUtil.durationRegex.exec(string);
    return moment.duration(_.toNumber(match[1]), match[2]);
};

momentUtil.validateDuration = function (string) {
    return momentUtil.durationRegex.test(string)
};

momentUtil.checkReminderDate = function (date, reminder, now) {
    if (_.isNil(now)) {
        now = moment();
    }

    date = moment(date);

    let reminderDate = date.clone().subtract(momentUtil.getDuration(reminder));

    return reminderDate.isSame(now, 'day');

};

module.exports = momentUtil;