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
        var place = req.params.place-1;
	var newTime = parseInt(req.params.time);
	var level = parseInt(req.params.level);//since leves are 0 indexed in db
	level = level -1;
        var nameq = "levels."+level+".data."+place+".name";
	var idq =   "levels."+level+".data."+place+".id";
	var timeq = "levels."+level+".data."+place+".time";
	//var timeq = "levels.$.data."+place+".time";
	var obj = {};
	obj[nameq] = req.params.name;
	obj[timeq] = req.params.time;
	obj[idq] = req.params.id;



	collection.find(
		{},
		{},
		function(e, docs){
			if(e==null){
				var previousTime = docs[0].levels[level].data[place].time;
				previousTime = parseInt(previousTime);
				var obj = {};
        obj[nameq] = req.params.name;
        obj[timeq] = req.params.time;
        obj[idq] = req.params.id;

				console.log("newTime: " + newTime + " previousTime: " + previousTime); 
				if(newTime < previousTime){//the new time is less than the previous time, put in db
				
					 collection.update(
						{},
				                //{ levels: { $elemMatch: {name : req.params.level}} },
              					  { $set: obj},
              					  function(e, docs){
                				        if(e == null){
                        				        res.send(docs);
                       					 }else{
                        				        res.send(e);
                       					 }
               					  }
      					);


				}else{
					res.send("your time of " +newTime+" did not beat "+ previousTime);
				}
			}else{
				res.send(e);
			}
		}
	);
/*

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


*/	
});




module.exports = router;
