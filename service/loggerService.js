const winston = require('winston');

const format = winston.format;
const logger = winston.createLogger({
    transports: [
        new winston.transports.Console({
            format: format.combine(
                format.timestamp(),
                format.colorize(),
                format.simple()
            )
        })
    ]
});

module.exports = logger;
