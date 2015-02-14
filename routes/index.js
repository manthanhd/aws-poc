var express = require('express');
var router = express.Router();


/* GET home page. */
router.get('/basic', function(req, res) {
  res.render('basic');
});

router.get('/material', function(req, res) {
  res.render('material');
});

module.exports = router;
