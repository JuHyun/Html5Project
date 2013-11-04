/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes/router.js');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
//app.set('view engine', 'jade'); // 1st modified
app.set('view engine', 'html');
//app.engine('.html', require('jqtpl').__express);	// express 3.3.1 version or less
app.engine('.html', require('jqtpl/lib/express').render); // express 3.4.4 version or later 
app.locals.layout = true;	//layout.html을 템플릿으로 사용함.

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
	app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/index.html', routes.index);
app.get('/coupon_best.html', routes.best);
app.get('/coupon_location.html', routes.location);
app.get('/coupon_all.html', routes.all);
app.get('/*.html', routes.forward);


http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
});