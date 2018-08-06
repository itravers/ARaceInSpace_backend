var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

//DB dependencies
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('localhost:27017/araceinspace');

var index = require('./routes/index');
var users = require('./routes/users');
var leaderboards = require('./routes/leaderboards');
var levelPacks = require('./routes/levelPacks');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Add DB to middleware
app.use(function(req, res, next){
  req.db = db;
  next();
});

app.use('/', index);
app.use('/users', users);
app.use('/leaderboards', leaderboards);
app.use('/levelpacks', levelPacks);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.locals.helloworld = function(){
  return "hello world";
}

/* Convert ms to min:sec:ms */
app.locals.msToString = function(timeMS){
	var time = timeMS;
	if(time == 99999999)return "";
	//console.log("timeMS: " + timeMS);
        var min = (time / 1000) / 60;
	min = Math.floor(min);
	//console.log("min: " + min);
        time = time - (min * 60 * 1000);
        var sec = time / 1000;
	sec = Math.floor(sec);
	//console.log("sec: " + sec);
        time = time - (sec * 1000);
        var ms = time;
	//console.log("ms : " + ms);
	//console.log(min + ":" + sec + ":" + ms);
        var minString = "";
	if(min != 0){
		minString = min + " Min : ";
	}
        return minString + sec+" Sec : "+ms+" Ms";

}

module.exports = app;
