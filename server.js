#!/usr/bin/env node

// import the required modules
var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var static = require('node-static');

var documentServer = require('./documentserver')

// define webroot, dynsroot folder path
const webroot = __dirname + '/htdocs';
const dynsroot = __dirname + '/dyns';

// define documents storage path
const docsPath = '/documents/';

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
    const path404 = '/error.html';

    // create a static file server
    var fileServer = new static.Server(webroot, {
        cache: false
    });
    
    var requestHandler = (req, res) => {

        // log the uri which has been requested
        console.log('[' + new Date().toISOString() + ']: ' + req.method + ' ' + req.url)

        var bodyData = '';

        // normalise path names to avoid issues
        req.url = path.normalize(req.url);

        req.on('data', (chunk) => {
            // prematurely terminate the request if exceeds a certain limit
            if(bodyData.length > 1e11) req.connection.destroy();
            else bodyData += chunk;
        });

        req.on('end', () => {
            var parsedUrl = url.parse(req.url);

            var dynOptions = dynPages[parsedUrl.pathname];

            // dynamically serviceable resources
            if(dynOptions !== undefined) {
                var page = require(
                    path.normalize(__dirname + '/' + dynOptions.dyn)
                ).servePage(req, res, dynOptions, bodyData);
            }

            // documents from database

            else if(parsedUrl.pathname.startsWith(docsPath)) {
                var page = documentServer.servePage(req, res, dynPages[path404])
            }

            // static resources
            else {
                fileServer.serve(req, res, (err) => {
                    if(err) {
                        var dynOptions = dynPages[path404];
                        var errorDescription = {
                            code: 404,
                            message: 'This is not the page that you\'re looking for.'
                        }
                        var page = require(
                            path.normalize(__dirname + '/' + dynOptions.dyn)
                        ).servePage(req, res, dynOptions, bodyData, errorDescription);
                    }
                });
            }
        }).resume();
    }
    
    // create the web server
    var httpServer = http.createServer(requestHandler);

    // define server port
    const port = process.env.PORT || 8080;

    // make server listen to port
    httpServer.listen(port);
    console.log(new Date().toDateString() + ', ' + new Date().toTimeString() + ': Started server at port ' + port);
}
