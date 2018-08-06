var express = require('express');
var zipdir = require('zip-dir');
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/*
zipdir('/path/to/be/zipped', { saveTo: '~/myzip.zip' }, function (err, buffer) {
  // `buffer` is the buffer of the zipped file
  // And the buffer was saved to `~/myzip.zip`
});
*/

/* GET individual level packs */
router.get('/:packNum', function(req, res, next){
  var packNum = req.params.packNum;
  zipdir('data/levelpacks/'+packNum, function (err, buffer) {
    // `buffer` is the buffer of the zipped file
    console.log("err: " + err);
    console.log("buffer: " + buffer);
    res.send(buffer);
  });
});

module.exports = router;
