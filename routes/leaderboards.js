var express = require('express');
var router = express.Router();

/* GET leaderboard website page. */
router.get('/', function(req, res, next) {
	var db = req.db;
	var collection = db.get('leaderboards');
	collection.find({}, {}, function (e, docs){
		res.render('leaderboards',{
			"docs" : docs,
			title : 'LeaderBoards'
		});
	});
});

router.get('/json', function(req, res, next){
	var db = req.db;
	var collection = db.get('leaderboards');
	collection.find({}, {}, function(e, docs){
		res.send(docs);
	});
});

router.get('/update/:level/:place/:name/:time/:id', function(req, res, next){
	var db = req.db;
	var collection = db.get('leaderboards');
	/*collection.find(
		{},
		{},
		function(e, docs){
			res.send(docs);
		}
	);*/
/*	collection.update( 
		{ data: { $elemMatch: { place: "1st" } } },
		{ $set: { 'data.$.name': req.params.name } },
		function(e, docs){
			res.send(docs);	
		}
	 );
*/

        var place = req.params.place-1;
        var q = "levels.$.data."+place+".name";
	var obj = {};
	obj[q] = req.params.name;
	collection.update(
                { levels: { $elemMatch: {name : req.params.level}} },
                //{ $set: { "levels.$.data.place.name": req.params.name } },
		{ $set: obj},
                function(e, docs){
			if(e == null){
                        	res.send(docs);
			}else{
                        	res.send(e);
			}
                }
         );


	
});




module.exports = router;
