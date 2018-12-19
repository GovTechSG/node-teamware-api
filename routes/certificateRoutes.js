const multer = require("multer");

const express = require('express');
const router = express.Router();
const certificateDao = require('../dao/certificateDao.js');
const _ = require('lodash');
const moment = require('moment');
const fsUtil = require('../util/fsUtil');
const parseCertUtil = require('../util/parseCertUtil');

let parseBody = function (reqBody) {

    let certificateAttributes = ['name', 'description', 'subject', 'issuer', 'notBefore', 'notAfter', 'owner', 'reminders', 'pem'];
    let certificate = _.omitBy(_.pick(reqBody, certificateAttributes), isNil);
    certificate.notBefore = moment(certificate.notBefore).toDate();
    certificate.notAfter = moment(certificate.notAfter).toDate();

    return certificate;
};

router.get('/', function (req, res, next) {
    return certificateDao.find({}, null, {lean: true})
        .then(function (results) {
            return res.jsonp(results);
        })
        .catch(function (err) {
            return next(err);
        });
});


router.get('/calendar', function (req, res, next) {

    return certificateDao.find()
        .then(function (certificates) {
            let events = [];
            _.each(certificates, function (certificate) {
                let updates = certificate.getUpdates();
                _.each(updates, function (update) {
                    events.push({
                        id: certificate._id,
                        title: update.message,
                        allDay: true,
                        url: `/certificates/${certificate._id}`,
                        start: moment(certificate.date).toISOString()
                    });
                });
            });

            return res.jsonp(events);
        })
        .catch(function (err) {
            return next(err);
        });
});

router.get('/:certificateId', function (req, res, next) {
    let certificateId = _.get(req.params, 'certificateId');

    return certificateDao.findOne({_id: certificateId}, null, {lean: true})
        .then(function (results) {
            return res.jsonp(results);
        })
        .catch(function (err) {
            return next(err);
        });
});


router.post('/', function (req, res, next) {
    let certificate = parseBody(req.body);

    return certificateDao.create(certificate)
        .then(function (results) {
            return res.jsonp(results);
        })
        .catch(function (err) {
            return next(err);
        });
});


router.put('/:certificateId', function (req, res, next) {
    let certificateId = _.get(req.params, 'certificateId');

    let certificate = parseBody(req.body);

    return certificateDao.findOneAndUpdate({_id: certificateId}, certificate, {lean: true})
        .then(function (results) {
            return res.jsonp(results);
        })
        .catch(function (err) {
            return next(err);
        });
});

router.delete('/:certificateId', function (req, res, next) {
    let certificateId = _.get(req.params, 'certificateId');
    return certificateDao.findOneAndDelete({_id: certificateId}, {lean: true})
        .then(function (results) {
            return res.jsonp(results);
        })
        .catch(function (err) {
            return next(err);
        });
});

let upload = multer({dest: 'temp/'});
router.post('/parse', upload.single('pem'), function (req, res, next) {

    let pem = _.get(req, 'file');
    if (!_.isEmpty(pem)) {
        let path = pem.path;

        return fsUtil.read(path)
            .then(function (data) {
                let certificateData = parseCertUtil.parse(data);
                return res.jsonp(certificateData);
            })
            .finally(function () {
                return fsUtil.delete(path);
            })
            .catch(function (err) {
                return next(err);
            });
    }


});


module.exports = router;
