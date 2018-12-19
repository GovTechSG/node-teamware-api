const app = require('../app.js');
const logger = require('../service/loggerService.js');
const mongooseService = require('../service/mongooseService.js');
const httpUtil = require('../util/httpUtil.js');
const Promise = require('bluebird');
const functionService = require('../service/functionService.js');

return mongooseService.connect()
    .then(function () {
        app.locals.mongooseService = mongooseService;
        app.locals.functionService = functionService;
        return functionService.init();
    })
    .then(function () {
        return httpUtil.initHttpServer(app);
    })
    .catch(function (e) {
        logger.error(e.stack);
        return process.exit(1)
    });

