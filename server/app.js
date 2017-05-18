const path = require('path');
const _ = require('lodash');
const express = require('express');
const hbs = require('express-hbs');
const {mongoose} = require('./db/mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
var flash = require("connect-flash");

var authRouter = require('./routes/auth');

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
app.use( flash());
// routes
app.get('/pickup', (req, res) => {
  res.render('pickup.hbs');
});

app.use("/", authRouter);

// server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Started on port ${port}`);
});