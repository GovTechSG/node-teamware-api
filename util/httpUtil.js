const https = require('https');
const http = require('http');
const fs = require('fs');
const _ = require('lodash');
const logger = require('../service/loggerService.js');
const DEFAULT_TLS_CERT_PATH = '/etc/x509/https/tls.crt';
const DEFAULT_TLS_KEY_PATH = '/etc/x509/https/tls.pem';


let httpUtil = {};

httpUtil.initHttpServer = function (app) {
    return new Promise(function (resolve, reject) {


        try {
            let tlsOptions = null;

            let tlsCert = null;
            if (_.has(process.env, 'TLS_CERT_PATH')) {
                tlsCert = fs.readFileSync(_.get(process.env, 'TLS_CERT_PATH'))
            } else if (fs.existsSync(DEFAULT_TLS_CERT_PATH)) {
                tlsCert = fs.readFileSync(DEFAULT_TLS_CERT_PATH)
            } else if (_.has(process.env, 'TLS_CERT')) {
                tlsCert = _.get(process.env, 'TLS_CERT');
            }

            let tlsKey = null;
            if (_.has(process.env, 'TLS_KEY_PATH')) {
                tlsKey = fs.readFileSync(_.get(process.env, 'TLS_KEY_PATH'));
            } else if (fs.existsSync(DEFAULT_TLS_KEY_PATH)) {
                tlsCert = fs.readFileSync(DEFAULT_TLS_KEY_PATH)
            } else if (_.has(process.env, 'TLS_KEY')) {
                tlsKey = _.get(process.env, 'TLS_KEY');
            }

            let tlsKeyPassphrase = _.get(process.env, 'TLS_KEY_PASSPHRASE');
            if (!_.isNil(tlsKey)) {
                if (!_.isNil(tlsKeyPassphrase)) {
                    tlsOptions.key = {pem: tlsKey, passphrase: tlsKeyPassphrase};
                } else {
                    tlsOptions.key = tlsKey;
                }
            }

            let tlsCa = null;
            if (_.has(process.env, 'TLS_CA_PATH')) {
                tlsCa = fs.readFileSync(_.get(process.env, 'TLS_CA_PATH'))
            } else if (_.has(process.env, 'TLS_CA')) {
                tlsCa = _.get(process.env, 'TLS_CA');
            }

            if (!_.isNil(tlsCert) && !_.isNil(tlsKey)) {
                tlsOptions = {
                    cert: tlsCert,
                    key: tlsKey,
                    ca: tlsCa
                }
            }

            let server = null;
            let serverPort = null;

            if (!_.isNil(tlsOptions)) {
                serverPort = _.get(process.env, 'PORT', 8443);
                server = https.createServer(tlsOptions, app);
                server.listen(serverPort);
                logger.info("Listening on https protocol on port " + serverPort.toString())
            } else {
                serverPort = _.get(process.env, 'PORT', 8080);
                server = http.createServer(app);
                server.listen(serverPort);
                logger.info("Listening on http protocol on port " + serverPort.toString())
            }

            process.once('SIGTERM', function () {
                logger.info("SIGTERM received. Terminating");
                server.close(function () {
                    process.exit(0);
                });
            });

            process.on('uncaughtException', function (err) {
                logger.error(err.stack);
            });

            process.on('unhandledRejection', function (err) {
                logger.error(err.stack);
            });

            return resolve(server);

        } catch (e) {
            return reject(e);
        }
    })
};

module.exports = httpUtil;
