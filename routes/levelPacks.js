var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET individual level packs */
router.get('/:packNum', function(req, res, next){
  var packNum = req.params.packNum;
  res.sendFile('data/levelpacks/1/testFile.txt');
});

module.exports = router;
