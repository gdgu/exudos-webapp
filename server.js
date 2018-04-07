#!/usr/bin/env node

// import the required modules
var http = require('http');
var fs = require('fs');
var querystring = require('querystring');
var url = require('url');
var static = require('node-static');

var htmldyn = require('./lib/htmldyn/htmldynmodule');
var dynserver = require('./lib/htmldyn/dynservermodule');

// define webroot, dynsroot folder path
const webroot = __dirname + '/htdocs';
const dynsroot = __dirname + '/dyns';

// populate the list of dynamically serviceable pages
const dynPagesFile = __dirname + '/dyns/dynhtdocs.json';
fs.readFile(dynPagesFile, "utf8", (err, data) => {
    // in case of error in reading file
    if(err) throw new Error("Could not populate the list of dynamically serviceable pages.\n" + err.message);

    var dynPages = JSON.parse(data);

    // start the web server
    startServer(webroot, dynPages);
});

var startServer = (webroot, dynPages) => {
    // define the path to 404.html
    const path404 = '/404';
    // create a dynamic file server
    var dynamicServer = new dynserver.Server(webroot, dynPages, dynsroot);

    // create a static file server
    var fileServer = new static.Server(webroot);

    // create the web server
    var httpServer = http.createServer((req, res) => {
        var bodyData = '';
        var cookies = '';

        req.on('data', (chunk) => {
            // prematurely terminate the request if exceeds a certain limit
            if(bodyData.length > 1e6) req.connection.destroy();
            else bodyData += chunk;
        });
        req.on('end', () => {
            var parsedUrl = url.parse(req.url);
            // dynamically serviceable resources
            if(dynPages[parsedUrl.pathname] !== undefined) {
                dynamicServer.serve(req, res);
            }
            // static resources
            else {
                fileServer.serve(req, res, (err) => {
                    if(err) {
                        req.url = path404;
                        dynamicServer.serve(req, res);
                    }
                });
            }
        }).resume();
    });

    // define server port
    const port = process.env.PORT || 8080;

    // make server listen to port
    httpServer.listen(port);
    console.log('Started server at port ' + port);
}
