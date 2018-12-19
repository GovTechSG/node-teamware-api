const express = require('express');
const router = express.Router();
const anniversaryDao = require('../dao/anniversaryDao.js');
const _ = require('lodash');
const moment = require('moment');


let parseBody = function (reqBody) {

    let anniversaryAttributes = ['name', 'description', 'event', 'date', 'reminders'];
    let anniversary = _.omitBy(_.pick(reqBody, anniversaryAttributes), isNil);
    anniversary.date = moment(anniversary.date).toDate();

    return anniversary;
};

router.get('/', function (req, res, next) {
    return anniversaryDao.find({}, null, {lean: true})
        .then(function (results) {
            return res.jsonp(results);
        })
        .catch(function (err) {
            return next(err);
        });
});

router.get('/calendar', function (req, res, next) {

    return anniversaryDao.find()
        .then(function (anniversaries) {
            let events = [];
            _.each(anniversaries, function (anniversary) {
                let updates = anniversary.getUpdates();
                _.each(updates, function (update) {
                    events.push({
                        id: anniversary._id,
                        title: update.message,
                        allDay: true,
                        url: `/anniversaries/${anniversary._id}`,
                        start: moment(anniversary.date).toISOString()
                    });
                });
            });

            return res.jsonp(events);
        })
        .catch(function (err) {
            return next(err);
        });
});

router.get('/:anniversaryId', function (req, res, next) {
    let anniversaryId = _.get(req.params, 'anniversaryId');

    return anniversaryDao.findOne({_id: anniversaryId}, null, {lean: true})
        .then(function (results) {
            return res.jsonp(results);
        })
        .catch(function (err) {
            return next(err);
        });
});


router.post('/', function (req, res, next) {
    let anniversary = parseBody(req.body);

    return anniversaryDao.create(anniversary)
        .then(function (results) {
            return res.jsonp(results);
        })
        .catch(function (err) {
            return next(err);
        });
});


router.put('/:anniversaryId', function (req, res, next) {
    let anniversaryId = _.get(req.params, 'anniversaryId');
    let anniversary = parseBody(req.body);

    return anniversaryDao.findOneAndUpdate({_id: anniversaryId}, anniversary, {lean: true})
        .then(function (results) {
            return res.jsonp(results);
        })
        .catch(function (err) {
            return next(err);
        });
});

router.delete('/:anniversaryId', function (req, res, next) {
    let anniversaryId = _.get(req.params, 'anniversaryId');
    return anniversaryDao.findOneAndDelete({_id: anniversaryId}, {lean: true})
        .then(function (results) {
            return res.jsonp(results);
        })
        .catch(function (err) {
            return next(err);
        });
});


module.exports = router;
