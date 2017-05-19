var express = require('express');
var router = express.Router();
var _ = require('lodash');
var User = require('../models/user');
var Bj = require('../models/bj');
var multer = require('multer');
const API_KEY = 'AIzaSyAuQCVeNfKhtRk9KlChQPT1nO27DPO_5Ss';
const YTSearch = require('youtube-api-search');
var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

var upload = multer({ storage: storage});


router.route('/pickup/')

    .get((req, res) => {
        Bj.find().then((bjs) => {
            res.render('bj/pickup.hbs', {
                bjs: bjs
            });
        });
    })

    .post((req, res) => {
        var body = _.pick(req.body, ['bj_ids']);
        var bj_ids = body.bj_ids;
        var user = req.user;
        user.bj_ids = bj_ids;
        user.save().then(() => {
            res.send('my page');
        }).then((bj_ids) => {
            for(var bj_id in bj_ids){
                console.log("bjs: " + bj_id);
            }
        }).catch((e) => {
            res.status(400).send(e);
        });
});


router.route('/add/')

    .get((req, res) => {
        res.render('bj/add_form.hbs', {
            Bj,
            user: req.user
        });
    })

    .post(upload.single('bj_picture'), (req, res) => {
        var body = _.pick(req.body, ['bj_name', 'info']);
        body.url = req.file.filename;
        var bj = new Bj(body);

        bj.save().then(() => {
            res.redirect('/bj/pickup');
        }).catch((e) => {
            res.status(400).send(e);
        });
    });

router.route('/recommend/')
    .get((req, res) => {
        YTSearch({key: API_KEY, term: "민아"},(videos) => {
            res.render('bj/recommend',{
                videos: videos,
                user: req.user
            });
        });
    });

router.route('/video/:id')
    .get((req, res) => {
        const videoId = req.params.id;
        const url = `https://www.youtube.com/embed/${videoId}`;
        res.render('bj/video',{
            url: url,
            user: req.user
        });
    });


module.exports = router;

