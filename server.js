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

    var dynPagesList = JSON.parse(data);

    // start the web server
    startServer(webroot, dynPagesList);
});

var serviceDynamicPage = (req, res, body) => {

    var currentPathname = url.parse(req.url).pathname

    if(currentPathname.endsWith('/')) {
        currentPathname = path.join(currentPathname, 'index.html')
    }

    var dyn = path.join(dynsroot, currentPathname.substring(0, currentPathname.lastIndexOf('.')) + '.dyn.js')
    
    var page = require(dyn)
    page.filePath = path.join(webroot, currentPathname)
    page.servePage(req, res, body)
}

var startServer = (webroot, dynPagesList) => {
    // define the path to 404.html
    const path404 = '/error.html?errorCode=404';

    // create a static file server
    var fileServer = new static.Server(webroot, {
        cache: false
    });
    
    var requestHandler = (req, res) => {

        // log the uri which has been requested
        console.log('[' + new Date().toISOString() + ']: ' + req.method + ' ' + req.url)

        var body = '';

        // normalise path names to avoid issues
        req.url = path.normalize(req.url);

        req.on('data', (chunk) => {
            // prematurely terminate the request if exceeds a certain limit
            if(body.length > 1e11) req.connection.destroy();
            else body += chunk;
        });

        req.on('end', () => {
            var parsedUrl = url.parse(req.url);
            
            // dynamically serviceable resources
            if(dynPagesList[parsedUrl.pathname]) {
                serviceDynamicPage(req, res, body)
            }

            // documents from database

            else if(parsedUrl.pathname.startsWith(docsPath)) {
                var page = documentServer.servePage(req, res, (err) => {
                    req.url = path404
                    serviceDynamicPage(req, res, body)
                })
            }

            // static resources
            else {
                fileServer.serve(req, res, (err) => {
                    req.url = path404
                    serviceDynamicPage(req, res, body)
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
