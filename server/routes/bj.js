var express = require('express');
var router = express.Router();
var _ = require('lodash');
var User = require('../models/user');
var Hash = require('../models/hash');
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
                bjs: bjs,
                user: req.user
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

        var body = _.pick(req.body, ['bj_name', 'info', 'hash_tags']);
        body.url = req.file.filename;
        var bj_id = res._id;
        var hash_tags = body.hash_tags;
        var hash_tag_ids = []
        for(var i=0; i<hash_tags.length; i++){
            var hash_tag = hash_tags[i];
            var hashC = { hash_tag, bj_id };
            var hs = new Hash(hashC);
            hash_tag_ids.push(hs._id);
            hs.save();
        }

        var bj = new Bj({
            bj_name: body.bj_name,
            info: body.info,
            hash_tags: hash_tag_ids,
            url: body.url
        });

        bj.save().then(() => {
            res.redirect('/bj/pickup');
        }).catch((e) => {
            res.status(400).send(e);
        });


        /*
         *   Bj.findOne
         *
         *    Bj.findOne 메서드에 콜백함수에서는

         문자열을 , 기준으로 배열로 생성한다.

         배열요소들을 해쉬 컬랙션에 데이터를 삽입한다.
         *
         * */

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

