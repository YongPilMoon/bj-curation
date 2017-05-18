const mongoose = require('mongoose');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
});


userSchema.pre('save', function (next) {
    var user = this;

    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(user.password, salt);

    console.log(user.password + "===>" + hash);

    user.password = hash;

    next();
});

userSchema.statics.authenticate = function(){
    return function(username, password, callback){
        User.findOne({username:username}, function(error, user) {
            if(error) return callback(error, null);
            if(!user) return callback(null, null);

            if(!bcrypt.compareSync(password, user.password)) {
                return callback(null, null);
            } else {
                return callback(null, user);
            }
        });
    }
};

userSchema.statics.serialize = function() {
    return function(user, done){
        done(null, user._id);
    }
};

userSchema.statics.deserialize = function() {
    return function(id, done){
        User.findById(id, function(err, user){
            done(err, user);
        })
    }
}

var User = mongoose.model('user', userSchema);

module.exports = User;