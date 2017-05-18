const path = require('path');
const _ = require('lodash');
const express = require('express');
const hbs = require('express-hbs');
const {mongoose} = require('./db/mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

//models
var {User}  = require('./models/user');

// app setting
var app = express();
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname,'/views'));
app.engine('hbs', hbs.express4({
    partialsDir: path.join(__dirname,'/views/partials'),
    layoutsDir: path.join(__dirname,'/views/layouts')
}));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.use(session({
    secret: '1234!@#!@!',
    resave: false,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());

// routes
app.get('/pickup', (req, res) => {
  res.render('pickup.hbs');
});

app.get('/user/register', (req, res) => {
    res.render('register.hbs');
});

app.post('/user/register', (req, res) => {
    var body = _.pick(req.body, ['username', 'password']);
    var user = new User(body);

    user.save().then(() => {
        res.redirect('/pickup');
    }).catch((e) => {
        res.status(400).send(e);
    });

});

app.post('/user/login',
    passport.authenticate(
        'local',
        {
            successRedirect: '/welcome',
            failureRedirect: 'user/login',
            failureFlash: false
        }
    )
);

app.get('/', (req, res) => {
    res.render('index.hbs');
});


// passport
passport.serializeUser(function(user, done) {
    console.log('serializeUser', user);
    done(null, user.username);
});

passport.deserializeUser(function(id, done) {
    console.log('deserializeUser', id);
    for(var i=0; i<users.length; i++){
        var user = users[i];
        if(user.username === id){
            done(null, user);
        }
    }
});

passport.use(new LocalStrategy(
    function(username, password, done){
        var uname = username;
        var pwd = password;
        for(var i=0; i<users.length; i++) {
            var user = users[i];
            if (uname === user.username && pwd === user.password) {
                return done(null, user);
            } else{
                return done(null, false);
            }
        }
        return done(null, false);
    }
));

// server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Started on port ${port}`);
});