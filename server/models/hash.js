const mongoose = require('mongoose');
const _ = require('lodash');
const multer = require('multer');

var hashSchema = new mongoose.Schema({

    hash_tag: {
        type: String,
        require: true
    },

    bj_id: {
        type: String,
        require: true
    }

});


var Hash = mongoose.model('hash_tags', hashSchema);

module.exports = Hash;
