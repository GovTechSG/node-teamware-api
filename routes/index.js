const express = require('express');
const router = express.Router();
const Promise = require('bluebird');
const _ = require('lodash');
const anniversaryRoutes = require('./anniversaryRoutes.js');
const assetRoutes = require('./assetRoutes.js');
const certificateRoutes = require('./certificateRoutes.js');
const eventRoutes = require('./eventRoutes.js');
const functionRoutes = require('./functionRoutes.js');
const userRoutes = require('./userRoutes.js');
const statusRoutes = require('./statusRoutes.js');
const chatRoutes = require('./chatRoutes.js');
const functionService = require('../service/functionService.js');

const anniversaryDao = require('../dao/anniversaryDao.js');
const assetDao = require('../dao/assetDao.js');
const certificateDao = require('../dao/certificateDao.js');
const eventDao = require('../dao/eventDao.js');
const statusDao = require('../dao/statusDao.js');


router.get('/', function (req, res, next) {
    return res.jsonp({status: 'OK'});
});

router.use('/anniversaries', anniversaryRoutes);
router.use('/assets', assetRoutes);
router.use('/certificates', certificateRoutes);
router.use('/events', eventRoutes);
router.use('/functions', functionRoutes);
router.use('/users', userRoutes);
router.use('/statuses', statusRoutes);
router.use('/chats', chatRoutes);

router.get('/exec/:functionName', function (req, res, next) {
    let functionName = _.get(req.params, 'functionName');
    return Promise.resolve(functionService.runFunction(functionService.functionNames[functionName]))
        .then(function (result) {
            return res.jsonp({result: result});
        })
        .catch(function (err) {
            return next(err);
        });

});

router.get('/calendar', function (req, res, next) {
    let now = _.get(req.query, 'now');

    return Promise.props({
        anniversaries: anniversaryDao.find(now)
            .then(function (anniversaries) {
                return Promise.map(anniversaries, function (anniversary) {
                    let updates = anniversary.getUpdates(now);
                    anniversary = anniversary.toObject();
                    anniversary.updates = updates;
                    return anniversary;
                });
            }),
        assets: assetDao.find()
            .then(function (assets) {
                return Promise.map(assets, function (asset) {
                    let updates = asset.getUpdates(now);
                    asset = asset.toObject();
                    asset.updates = updates;
                    return asset;
                })
            }),
        certificates: certificateDao.find()
            .then(function (certificates) {
                return Promise.map(certificates, function (certificate) {
                    let updates = certificate.getUpdates(now);
                    certificate = certificate.toObject();
                    certificate.updates = updates;
                    return certificate;
                })
            }),
        events: eventDao.find()
            .then(function (events) {
                return Promise.map(events, function (event) {
                    let updates = event.getUpdates(now);
                    event = event.toObject();
                    event.updates = updates;
                    return event;
                })
            }),
        status: statusDao.find()
            .then(function (statuses) {
                return Promise.map(statuses, function (status) {
                    let updates = status.getUpdates(now);
                    status = status.toObject();
                    status.updates = updates;
                    return status;
                })
            }),
    })
        .then(function (props) {

            let updates = [];

            _.each(props.assets, function (asset) {
                _.each(asset.updates, function (update) {
                    updates.push({
                        id: asset._id,
                        title: asset.update.message,
                        allDay: true,
                        start: moment(asset.date || asset.reminderDate).toISOString()
                    });
                });
            });

            _.each(props.anniversaries, function (anniversary) {

                updates.push({
                    id: anniversary._id,
                    title: anniversary.update.message,
                    allDay: true,
                    start: moment(anniversary.date || anniversary.reminderDate).toISOString(),
                });
            });


            _.get(props.certificates, function (certificate) {
                updates.push({
                    id: certificate._id,
                    title: certificate.update.message,
                    allDay: true,
                    start: moment(certificate.date || certificate.reminderDate).toISOString(),
                });
            });


            _.get(props.events, function (event) {
                updates.push({
                    id: event._id,
                    title: event.update.message,
                    allDay: true,
                    start: moment(event.date || event.reminderDate).toISOString(),
                    end: _.has(event, 'endDate') ? moment(event.endDate).toISOString() : null,
                });
            });

            _.get(props.status, function (status) {
                updates.push({
                    id: status._id,
                    title: status.update.message,
                    allDay: true,
                    start: moment(status.date || status.reminderDate).toISOString(),
                    end: _.has(status, 'endDate') ? moment(status.endDate).toISOString() : null,
                });
            });

            return res.jsonp(updates);
        });

});

module.exports = router;
