const express = require('express');
const router = express.Router();
const assetDao = require('../dao/assetDao.js');
const _ = require('lodash');
const moment = require('moment');

let parseBody = function (reqBody) {

    let assetAttributes = ['name', 'description', 'assetType', 'supplier', 'attributes', 'owner', 'renewalDate', 'expiryDate', 'renewalReminders', 'expiryReminders'];

    let asset = _.omitBy(_.pick(reqBody, assetAttributes), isNil);
    asset.renewalDate = moment(asset.renewalDate).toDate();
    asset.expiryDate = moment(asset.expiryDate).toDate();

    return asset;
};

router.get('/', function (req, res, next) {
    return assetDao.find({}, null, {lean: true})
        .then(function (results) {
            return res.jsonp(results);
        })
        .catch(function (err) {
            return next(err);
        });
});


router.get('/calendar', function (req, res, next) {
    return assetDao.find()
        .then(function (assets) {
            let events = [];
            _.each(assets, function (asset) {
                let updates = asset.getUpdates();
                _.each(updates, function (update) {
                    events.push({
                        id: asset._id,
                        title: update.message,
                        allDay: true,
                        url: `/assets/${asset._id}`,
                        start: moment(asset.date).toISOString()
                    });
                });
            });

            return res.jsonp(events);
        })
        .catch(function (err) {
            return next(err);
        });
});



router.get('/:assetId', function (req, res, next) {
    let assetId = _.get(req.params, 'assetId');

    return assetDao.findOne({_id: assetId}, null, {lean: true})
        .then(function (results) {
            return res.jsonp(results);
        })
        .catch(function (err) {
            return next(err);
        });
});


router.post('/', function (req, res, next) {

    let asset = parseBody(req.body);

    return assetDao.create(asset)
        .then(function (results) {
            return res.jsonp(results);
        })
        .catch(function (err) {
            return next(err);
        });
});


router.put('/:assetId', function (req, res, next) {
    let assetId = _.get(req.params, 'assetId');
    let asset = parseBody(req.body);

    return assetDao.findOneAndUpdate({_id: assetId}, asset, {lean: true})
        .then(function (results) {
            return res.jsonp(results);
        })
        .catch(function (err) {
            return next(err);
        });
});

router.delete('/:assetId', function (req, res, next) {
    let assetId = _.get(req.params, 'assetId');
    return assetDao.findOneAndDelete({_id: assetId}, {lean: true})
        .then(function (results) {
            return res.jsonp(results);
        })
        .catch(function (err) {
            return next(err);
        });
});


module.exports = router;
