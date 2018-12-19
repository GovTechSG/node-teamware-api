const Schema = require('mongoose').Schema;
const moment = require('moment');
const _ = require('lodash');

let FunctionStorage = new Schema({
    function: {type: Schema.Types.ObjectId, required: true},
    key: {
        type: String,
        required: true
    },
    value: {
        type: Schema.Types.Mixed,
        required: true
    }

});

FunctionStorage.index({function: 1, key: 1}, {unique: true})

module.exports = FunctionStorage;
