var express = require('express');
var router = express.Router();
var _ = require('lodash');
var User = require('../models/user');
var Bj = require('../models/bj');
var Hash = require('../models/hash');
var multer = require('multer');
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
            res.render('pickup.hbs', {
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
        }).catch((e) => {
            res.status(400).send(e);
        });
});


router.route('/add/')


    .get((req, res) => {
        res.render('bj/add_form.hbs', {Bj});
    })

    .post(upload.single('bj_picture'), (req, res) => {

        // var body = _.pick(req.body, ['bj_name', 'info','hash_tag']);
        var body = _.pick(req.body, ['bj_name','info']);
        // console.log(body);
        body.url = req.file.filename;
        var bj = new Bj(body);

        bj.save().then(() => {
            Bj.findOne({bj_name : body.bj_name}, function (err,res){
                /*console.log("result : " + res);
                console.log("result _id :: " + res._id);*/
                var bj_id = res._id;

                var hash_tag_list = req.body.hash_tag; // all hash tag
                var hash_tags = hash_tag_list.split(','); // array

                for(var i=0; i<hash_tags.length; i++){
                    var hash_tag = hash_tags[i];
                    var hashC = { hash_tag, bj_id };
                    var hs = new Hash(hashC);
                    hs.save();
                }
            });
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


        res.redirect('/bj/pickup');

    });


module.exports = router;

