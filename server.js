// import the required modules
var http = require('http');
var fs = require('fs');
var querystring = require('querystring');
var url = require('url');
var static = require('node-static');

var htmldyn = require('./htmldynmodule.js');

// define webroot folder
const webroot = __dirname + '/htdocs';

// populate the list of dynamically serviceable pages
const dynPagesFile = __dirname + '/dynhtdocs.json';
fs.readFile(dynPagesFile, "utf8", (err, data) => {
    // in case of error in reading file
    if(err) throw new Error("Could not populate the list of dynamically serviceable pages.\n" + err.message);

    var dynPages = JSON.parse(data);

    startServer(webroot, dynPages);
});

var startServer = (webroot, dynPages) => {
    // create a dynamic file server
    var dynamicServer

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
}
