const express = require('express');
const router = express.Router();
const chatDao = require('../dao/chatDao.js');
const _ = require('lodash');
const moment = require('moment');

/*
chatId: {type: Number, required: true, unique: true},
type: {type: String, required: true},
title: {type: String},
username: {type: String},
firstName: {type: String},
lastName: {type: String}
*/

let parseBody = function (reqBody) {

    let chatAttributes = ['chatId', 'type', 'title', 'username', 'firstName', 'lastName'];


    return _.omitBy(_.pick(reqBody, chatAttributes), isNil);
};


router.get('/', function (req, res, next) {
    return chatDao.find({}, null, {lean: true})
        .then(function (results) {
            return res.jsonp(results);
        })
        .catch(function (err) {
            return next(err);
        });
});

router.get('/:chatId', function (req, res, next) {
    let chatId = _.get(req.params, 'chatId');

    return chatDao.findOne({_id: chatId}, null, {lean: true})
        .then(function (results) {
            return res.jsonp(results);
        })
        .catch(function (err) {
            return next(err);
        });
});

router.post('/', function (req, res, next) {

    let chat = parseBody(req.body);


    return chatDao.create(chat)
        .then(function (results) {
            return res.jsonp(results);
        })
        .catch(function (err) {
            return next(err);
        });
});


router.put('/:chatId', function (req, res, next) {
    let chatId = _.get(req.params, 'chatId');
    let chat = parseBody(req.body);

    return chatDao.findOneAndUpdate({_id: chatId}, chat, {lean: true})
        .then(function (results) {
            return res.jsonp(results);
        })
        .catch(function (err) {
            return next(err);
        });
});

router.delete('/:chatId', function (req, res, next) {
    let chatId = _.get(req.params, 'chatId');
    return chatDao.findOneAndDelete({_id: chatId}, {lean: true})
        .then(function (results) {
            return res.jsonp(results);
        })
        .catch(function (err) {
            return next(err);
        });
});


module.exports = router;
