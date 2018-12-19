const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const responseTime = require('response-time');
const logger = require('./service/loggerService.js');
const addRequestId = require('express-request-id');
const expressWinston = require('express-winston');
const routes = require('./routes/index.js');
const nunjucks = require("nunjucks");
const app = express();

app.use(bodyParser.json());
app.use(cookieParser());
app.use(responseTime());
app.use(addRequestId());

app.use(expressWinston.logger({
    winstonInstance: logger,
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    expressFormat: true,
    colorize: false
}));


app.use(routes);

app.use(function (req, res, next) {
    return next(new createError(404));
});

app.use(function (err, req, res, next) {

    logger.error(err.stack);

    res.status(err.status || 500);
    return res.jsonp({
        status: err.status || 500,
        message: err.message
    });

});

module.exports = app;