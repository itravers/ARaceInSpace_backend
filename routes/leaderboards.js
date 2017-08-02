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

router.post('/submitGhost', function(req, res, next){
	var db = req.db;
	var collection = db.get('ghosts');
	var jsonRecord = '{"ghost":'+JSON.stringify(req.body)+'}';//make entire request a json file
	console.log(jsonRecord);
	//console.log(jsonRecord);
	var string = '{"ghost":[{"class":"com.araceinspace.InputSubSystem.Action","frameNum":9,"input":"BOOST_PRESSED"},{"class":"com.araceinspace.InputSubSystem.Action","frameNum":3575,"input":"PLAYTIME"}]}';
	var jsonString = JSON.parse(jsonRecord);
	//var parsedJson = JSON.parse(jsonRecord); //parse request json into storable string
        //console.log(jsonRecord);
	collection.insert(
		jsonString,
		function(e, docs){
			if(e == null){
				res.send("success");
			}else{
				console.log(e);
			}
		}
	);
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
                        				        res.send("success");
                       					 }else{
                        				        res.send(e);
                       					 }
               					  }
      					);


				}else{
					res.send("Not Fast Enough");
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


function rand_string(n) {
    if (n <= 0) {
        return '';
    }
    var rs = '';
    try {
	var crypto = require('crypto');
        rs = crypto.randomBytes(Math.ceil(n/2)).toString('hex').slice(0,n);
        /* note: could do this non-blocking, but still might fail */
    }
    catch(ex) {
        /* known exception cause: depletion of entropy info for randomBytes */
        console.error('Exception generating random string: ' + ex);
        /* weaker random fallback */
        rs = '';
        var r = n % 8, q = (n-r)/8, i;
        for(i = 0; i < q; i++) {
            rs += Math.random().toString(16).slice(2);
        }
        if(r > 0){
            rs += Math.random().toString(16).slice(2,i);
        }
    }
    return rs;
}


module.exports = router;
