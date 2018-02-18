// import the required modules
var http = require('http');
var fs = require('fs');
var querystring = require('querystring');

var htmldyn = require('./htmldynmodule.js');
var static = require('./staticservemodule.js');

// define webroot folder and a list of files with path, encoding, etc.
const webroot = __dirname + '/htdocs';
const htdocs = JSON.parse(fs.readFileSync('htdocs.json', 'utf8'));

// create the server
var server = http.createServer(static.serve(webroot, htdocs));

// define server port
const port = process.env.PORT || 8080;

// make server listen to port
server.listen(port);
console.log('Started server at port ' + port);
