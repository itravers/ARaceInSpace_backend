var express = require('express');
var zipdir = require('zip-dir');
var fs = require('fs');
var router = express.Router();


/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log('You have a lag set in this function');
  setTimeout(function() {
    res.send('respond with a resource');
    console.log('Blah blah blah blah extra-blah');
  }, 10000);
});

/*
zipdir('/path/to/be/zipped', { saveTo: '~/myzip.zip' }, function (err, buffer) {
  // `buffer` is the buffer of the zipped file
  // And the buffer was saved to `~/myzip.zip`
});
*/

/* GET individual level packs */
router.get('/get/:packNum', function(req, res, next){
console.log('You have a lag set in this function');//take this out
setTimeout(function() {//take this out
  var packNum = req.params.packNum;
  zipdir('data/levelpacks/'+packNum, function (err, buffer) {
    // `buffer` is the buffer of the zipped file
    console.log("err: " + err);
//    console.log("buffer: " + buffer);
    res.send(buffer);
  });
}, 10000);//take this out
});

/* GET respond with a string that has each level pack that is
   available delimited by spaces
*/
router.get('/packsAvailable', function(req, res, next){
  var packsAvailable = "";
  fs.readdirSync('data/levelpacks/').forEach(file => {
    packsAvailable += " " + file;
  });
    res.send(packsAvailable);
});

/* GET check if given level pack exists */
router.get('/check/:packNum', function(req, res, next){
  var packNum = req.params.packNum;
  checkDirectory('data/levelpacks/'+packNum, function(error){
    var response = "false";
    if(error){
      //directory does not exist, so level pack doesn't exist
      reponse = "false";
    }else{
      //directory DOES exist, so level pack DOES exist
      response = "true";
    }
    res.send(response);
  });
});

/** Check if a given directory exists */
function checkDirectory(directory, callback) {  
  fs.stat(directory, function(err, stats) {
    //Check if error defined and the error code is "not exists"
    if (err && err.errno === 34) {
      callback(err);
    } else {
      //just in case there was a different error:
      callback(err)
    }
  });
}


module.exports = router;
