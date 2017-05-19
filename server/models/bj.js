const mongoose = require('mongoose');
const _ = require('lodash');
const multer = require('multer');

var bjSchema = new mongoose.Schema({
    bj_name: {
        type: String,
        minlength: 1,
        trim: true
    },
    info: {
        type: String
    },
    url:{
        type: String
    },
    hash_tags: [{type: mongoose.Schema.Types.ObjectId, ref: 'Hash'}]
});


var Bj = mongoose.model('bj', bjSchema);

module.exports = Bj;