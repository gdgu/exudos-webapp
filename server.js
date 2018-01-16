// import the required modules
var http = require('http');
// var static = require('node-static');
var querystring = require('querystring');

var htmldyn = require('./htmldynmodule.js');

// create the server
var server = http.createServer((req, res) => { 
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(require('./sampleimplementation.js').html);
});

// define server port
const port = 8080;

// make server listen to port
server.listen(8080);
console.log('Started server at port ' + port);