const express = require('express');
const router = express.Router();
const eventDao = require('../dao/eventDao.js');
const _ = require('lodash');
const moment = require('moment');


let parseBody = function (reqBody) {

    let eventAttributes = ['name', 'description', 'date', 'reminders'];

    let event = _.omitBy(_.pick(reqBody, eventAttributes), _.isNil);
    event.date = moment(event.date).toDate();

    return event;
};

router.get('/', function (req, res, next) {
    return eventDao.find({}, null, {lean: true})
        .then(function (results) {
            return res.jsonp(results);
        })
        .catch(function (err) {
            return next(err);
        });
});


router.get('/calendar', function (req, res, next) {

    return eventDao.find()
        .then(function (events) {
            let calendarEvents = [];
            _.each(events, function (event) {
                let updates = event.getUpdates();
                _.each(updates, function (update) {

                    calendarEvents.push({
                        id: event._id,
                        title: update.message,
                        allDay: _.isNil(event.endDate),
                        url: `/events/${event._id}`,
                        start: moment(event.date).toISOString(),
                        end: _.isNil(event.endDate)?null:moment(event.endDate).toISOString()

                    });
                });
            });

            return res.jsonp(calendarEvents);
        })
        .catch(function (err) {
            return next(err);
        });
});


router.get('/:eventId', function (req, res, next) {
    let eventId = _.get(req.params, 'eventId');

    return eventDao.findOne({_id: eventId}, null, {lean: true})
        .then(function (results) {
            return res.jsonp(results);
        })
        .catch(function (err) {
            return next(err);
        });
});

router.post('/', function (req, res, next) {

    let event = parseBody(req.body);


    return eventDao.create(event)
        .then(function (results) {
            return res.jsonp(results);
        })
        .catch(function (err) {
            return next(err);
        });
});


router.put('/:eventId', function (req, res, next) {
    let eventId = _.get(req.params, 'eventId');

    let event = parseBody(req.body);

    return eventDao.findOneAndUpdate({_id: eventId}, event, {lean: true})
        .then(function (results) {
            return res.jsonp(results);
        })
        .catch(function (err) {
            return next(err);
        });
});

router.delete('/:eventId', function (req, res, next) {
    let eventId = _.get(req.params, 'eventId');
    return eventDao.findOneAndDelete({_id: eventId}, {lean: true})
        .then(function (results) {
            return res.jsonp(results);
        })
        .catch(function (err) {
            return next(err);
        });
});


module.exports = router;
