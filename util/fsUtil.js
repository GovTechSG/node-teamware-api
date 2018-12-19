const _ = require('lodash');
const fs = require('fs');
const nodePath = require('path');
const Promise = require('bluebird');

const fsUtil = {};

fsUtil.read = function (path) {
    try {
        path = nodePath.resolve(process.cwd(), path);
        return new Promise(function (resolve, reject) {
            return fs.readFile(path, function (err, data) {
                if (!_.isNil(err)) {
                    return reject(err);
                }
                return resolve(data);
            });
        });
    } catch (err) {
        return Promise.reject(err);
    }
};


fsUtil.delete = function (path) {
    try {
        path = nodePath.resolve(process.cwd(), path);
        return new Promise(function (resolve, reject) {
            return fs.unlink(path, function (err) {
                if (!_.isNil(err)) {
                    return reject(err);
                }
                return resolve();
            });
        });
    } catch (err) {
        return Promise.reject(err);
    }
};

module.exports = fsUtil;