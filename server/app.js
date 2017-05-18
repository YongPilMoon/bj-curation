var path = require('path');
const express = require('express');
const hbs = require('express-hbs');
const {mongoose} = require('./db/mongoose');

var app = express();
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname,'/views'));
app.engine('hbs', hbs.express4({
    partialsDir: path.join(__dirname,'/views/partials'),
    layoutsDir: path.join(__dirname,'/views/layouts')
}));



app.use(express.static(__dirname + '/public'));
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.render('index.hbs');
});

app.listen(port, () => {
    console.log(`Started on port ${port}`);
});