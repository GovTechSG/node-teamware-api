const express = require('express');
const router = express.Router();
const statusDao = require('../dao/statusDao.js');
const _ = require('lodash');
const moment = require('moment');


let parseBody = function (reqBody) {

    let statusAttributes = ['name', 'description', 'date', 'reminders'];

    let status = _.omitBy(_.pick(reqBody, statusAttributes), isNil);
    status.date = moment(status.date).toDate();

    return status;
};

router.get('/', function (req, res, next) {
    return statusDao.find({}, null, {lean: true})
        .then(function (results) {
            return res.jsonp(results);
        })
        .catch(function (err) {
            return next(err);
        });
});


router.get('/calendar', function (req, res, next) {

    return statusDao.find()
        .then(function (statuses) {
            let events = [];
            _.each(statuses, function (status) {
                let updates = status.getUpdates();
                _.each(updates, function (update) {

                    events.push({
                        id: status._id,
                        title: update.message,
                        allDay: _.isNil(status.endDate),
                        url: `/statuses/${status._id}`,
                        start: moment(status.date).toISOString(),
                        end: _.isNil(status.endDate) ? null : moment(status.endDate).toISOString()

                    });
                });
            });

            return res.jsonp(events);
        })
        .catch(function (err) {
            return next(err);
        });
});

router.get('/:statusId', function (req, res, next) {
    let statusId = _.get(req.params, 'statusId');

    return statusDao.findOne({_id: statusId}, null, {lean: true})
        .then(function (results) {
            return res.jsonp(results);
        })
        .catch(function (err) {
            return next(err);
        });
});

router.post('/', function (req, res, next) {

    let status = parseBody(req.body);


    return statusDao.create(status)
        .then(function (results) {
            return res.jsonp(results);
        })
        .catch(function (err) {
            return next(err);
        });
});


router.put('/:statusId', function (req, res, next) {
    let statusId = _.get(req.params, 'statusId');

    let status = parseBody(req.body);

    return statusDao.findOneAndUpdate({_id: statusId}, status, {lean: true})
        .then(function (results) {
            return res.jsonp(results);
        })
        .catch(function (err) {
            return next(err);
        });
});

router.delete('/:statusId', function (req, res, next) {
    let statusId = _.get(req.params, 'statusId');
    return statusDao.findOneAndDelete({_id: statusId}, {lean: true})
        .then(function (results) {
            return res.jsonp(results);
        })
        .catch(function (err) {
            return next(err);
        });
});


module.exports = router;
