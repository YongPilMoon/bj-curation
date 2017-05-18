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
        res.render('auth/register.hbs');
    })

    .post((req, res) => {
        var body = _.pick(req.body, ['username', 'password']);
        var user = new User(body);

        user.save().then(() => {
            res.redirect('/pickup');
        }).catch((e) => {
            res.status(400).send(e);
        });
    });



router.route('/login/')

    .get(function(req, res, next) {
        return res.render("auth/login.hbs");
    })

    .post(
        passport.authenticate('local'),
        (req, res, next) =>{
            req.flash("success", "성공적으로 로그인 되었습니다.");
            var redirectUrl = req.body.next || "/";
            return res.redirect(redirectUrl);
        }
    );


router.get('/', (req, res) => {
    res.render('index.hbs');
});



module.exports = router;

