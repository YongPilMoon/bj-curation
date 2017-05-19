const mongoose = require('mongoose');
const _ = require('lodash');
const multer = require('multer');

var bjSchema = new mongoose.Schema({
    bj_name: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    info: {
        type: String,
        required: true
    },
    url:{
        type: String
    }
});


var Bj = mongoose.model('bj', bjSchema);

module.exports = Bj;