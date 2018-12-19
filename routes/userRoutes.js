const express = require('express');
const router = express.Router();
const userDao = require('../dao/userDao.js');
const _ = require('lodash');
const moment = require('moment');


let parseBody = function (reqBody) {

    let userAttributes = ['username', 'password', 'telegramId'];


    return _.omitBy(_.pick(reqBody, userAttributes), isNil);
};


router.get('/', function (req, res, next) {
    return userDao.find({}, null, {lean: true})
        .then(function (results) {
            return res.jsonp(results);
        })
        .catch(function (err) {
            return next(err);
        });
});

router.get('/:userId', function (req, res, next) {
    let userId = _.get(req.params, 'userId');

    return userDao.findOne({_id: userId}, null, {lean: true})
        .then(function (results) {
            return res.jsonp(results);
        })
        .catch(function (err) {
            return next(err);
        });
});

router.post('/', function (req, res, next) {

    let user = parseBody(req.body);


    return userDao.create(user)
        .then(function (results) {
            return res.jsonp(results);
        })
        .catch(function (err) {
            return next(err);
        });
});


router.put('/:userId', function (req, res, next) {
    let userId = _.get(req.params, 'userId');
    let user = parseBody(req.body);

    return userDao.findOneAndUpdate({_id: userId}, user, {lean: true})
        .then(function (results) {
            return res.jsonp(results);
        })
        .catch(function (err) {
            return next(err);
        });
});

router.delete('/:userId', function (req, res, next) {
    let userId = _.get(req.params, 'userId');
    return userDao.findOneAndDelete({_id: userId}, {lean: true})
        .then(function (results) {
            return res.jsonp(results);
        })
        .catch(function (err) {
            return next(err);
        });
});


module.exports = router;
