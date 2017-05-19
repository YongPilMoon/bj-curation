var express = require('express');
var router = express.Router();
var passport = require("passport");
var _ = require('lodash');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');

passport.use( new LocalStrategy( User.authenticate() ) );
passport.serializeUser( User.serialize() );
passport.deserializeUser( User.deserialize() );

router.route('/register/')

    .get((req, res) => {
        res.render('auth/register.hbs', {
            user: req.user
        });
    })

    .post((req, res) => {
        var body = _.pick(req.body, ['username', 'password']);
        var user = new User(body);

        user.save().then(() => {
            res.redirect('/bj/pickup');
        }).catch((e) => {
            res.status(400).send(e);
        });
    });



router.route('/login/')

    .get(function(req, res, next) {
        return res.render("auth/login.hbs", {
            user: req.user
        });
    })

    .post(
        passport.authenticate(
            'local',
            {
                successRedirect: 'bj/recommend/',
                failureRedirect: '/login',
                failureFlash: false
            }
        )
);

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
});

router.get('/', (req, res) => {
    res.render('index.hbs', {
        user: req.user
    });
});



module.exports = router;

