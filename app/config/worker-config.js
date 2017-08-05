var http = require('http');
var express = require('express');
var application = express();
var bodyParser = require('body-parser');
var routeConfig = require('./route-config');

function configureWorker(application) {
  configureApplication(application);
  configureRoutes(application);

  startServer(application);
}

function configureApplication(application) {
  application.use(bodyParser.urlencoded({extended: true}));
  application.use(bodyParser.json());
  application.set('port', (process.env.PORT || 9283));
  application.use(express.static('app/assets'));

  application.use(function(req, res, next) {
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Access-Control-Allow-Origin', '*');
    res.type('application/json');
    next();
  });
}

function configureRoutes(application) {
  routeConfig.registerRoutes(application);
}

function startServer(application) {
  var server = http.createServer(application);

  
  server.listen(application.get('port'), function() {
  console.log('Node app is running on port', application.get('port'));
});
}

configureWorker(application);
