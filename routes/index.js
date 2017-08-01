var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/uses', function(req, res){
  var db = req.db;
  var collection = db.get('weatherqueries');
  collection.find({}, {}, function(e, docs){
//    console.log("DOCS FOLLOW");
//    console.log(docs);
    var forecasts = new Array();
    for(var i = 0; i < docs.length; i++){
      var fString = docs[i].forecast;
      fString = fString.substring(1, fString.length);
      var fArray = fString.split("$");
      forecasts.push(fArray);
    }
//    console.log("FORECASTS ARRAY FOLLOWS");
//    console.log(forecasts);
    res.render('uses', {
      moment: require('moment'),
      "uses" : docs,
      "forecasts" : forecasts
    });
  });
});

module.exports = router;
