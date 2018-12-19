const express = require('express');
const router = express.Router();
const functionDao = require('../dao/functionDao.js');
const _ = require('lodash');
const moment = require('moment');
const functionService = require('../service/functionService.js');

let parseBody = function (reqBody) {

    let functionAttributes = ['name', 'description', 'code', 'active', 'cron'];

    return _.omitBy(_.pick(reqBody, functionAttributes), function (value) {
        if (_.isNil(value)) {
            return true;
        }
        if (_.isString(value) && _.isEmpty(value)) {
            return true;
        }
        return false;
    });
};


router.get('/', function (req, res, next) {
    return functionDao.find({}, null, {lean: true})
        .then(function (results) {
            return res.jsonp(results);
        })
        .catch(function (err) {
            return next(err);
        });
});

router.get('/:functionId', function (req, res, next) {
    let functionId = _.get(req.params, 'functionId');

    return functionDao.findOne({_id: functionId}, null, {lean: true})
        .then(function (results) {
            return res.jsonp(results);
        })
        .catch(function (err) {
            return next(err);
        });
});

router.post('/', function (req, res, next) {

    let _function = parseBody(req.body);


    return functionDao.create(_function)
        .then(function (_function) {
            functionService.addFunction(_function);

            return res.jsonp(_function);
        })
        .catch(function (err) {
            return next(err);
        });
});


router.put('/:functionId', function (req, res, next) {
    let functionId = _.get(req.params, 'functionId');
    let _function = parseBody(req.body);


    return functionDao.findOneAndUpdate({_id: functionId}, _function, {lean: true})
        .then(function (results) {
            functionService.addFunction(results);
            return res.jsonp(results);
        })
        .catch(function (err) {
            return next(err);
        });
});

router.delete('/:functionId', function (req, res, next) {
    let functionId = _.get(req.params, 'functionId');
    return functionDao.findOneAndDelete({_id: functionId}, {lean: true})
        .then(function (results) {
            let functionId = _.get(results,'id');
            if (!_.isNil(functionId)){
                functionService.deleteFunction(functionId);
            }
            return res.jsonp(results);
        })
        .catch(function (err) {
            return next(err);
        });
});


module.exports = router;
