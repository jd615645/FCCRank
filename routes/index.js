var express = require('express');
var router = express.Router();
var io = require('socket.io')();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/rank', function(req, res, next) {
  res.render('rank');
});

module.exports = router;
