// import the required modules
var http = require('http');
var fs = require('fs');
var querystring = require('querystring');
var url = require('url');
var static = require('node-static');

var htmldyn = require('./htmldynmodule.js');

// define webroot folder and a list of files with path, encoding, etc.
const webroot = __dirname + '/htdocs';

// create a static file server
var fileServer = new static.Server(webroot);

// create the server
var httpServer = http.createServer((req, res) => {
    fileServer.serve(req, res);
});

// define server port
const port = process.env.PORT || 8080;

// make server listen to port
httpServer.listen(port);
console.log('Started server at port ' + port);
