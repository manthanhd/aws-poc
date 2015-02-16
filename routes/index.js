var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/basic', function(req, res) {
  res.render('basic');
});

router.get('/material', function(req, res) {
  res.render('material');
});

router.get('/ping', function(req, res) {
    res.send({status: 'OK'});
})

module.exports = router;
