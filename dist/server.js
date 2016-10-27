'use strict';

var express 		= require('express');
var path 				= require('path');
var http    		= require('http');
var logger 			= require('morgan');
var bodyParser 	= require('body-parser');
var favicons 		= require('connect-favicons');
var compress 		= require('compression');
var helmet 			= require('helmet');
var engines 		= require('consolidate');
var router 			= express.Router();
var app 				= express();

app.use(compress());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy({setTo:'eLawyer Rulez'}));
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Content-Length, Authorization, Accept'
  );
  next();
});

app.use(express.static(path.join(__dirname)));
app.set('views', path.join(__dirname));
app.engine('html', engines.mustache);
app.set('view engine', 'html');

router.get('/', function(req, res) {
  res.render('index.html');
});

app.use('*', router);
app.set('port', process.env.PORT || 3030);

http
	.createServer(app)
	.listen(app.get('port'), function() {
		console.log('eLawyer Server is running on port ' + app.get('port'));
	});
