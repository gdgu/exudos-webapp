'use strict';

// import required modules
var url = require('url');
var fs = require('fs');
var cookie = require('cookie');

var htmldyn = require('./htmldynmodule');

class DynamicServer {
    constructor(webroot, dynpages, dynsroot) {
        // type errors
        if(typeof webroot !== 'string') throw new TypeError('first argument "webroot" must be of type string, ' + typeof webroot + ' found');
        if(typeof dynpages !== 'object') throw new TypeError('second argument "dynPages" must be of type object, ' + typeof dynpages + ' found');
        if(typeof dynsroot !== 'string') throw new TypeError('third argument "dynsroot" must be of type string, ' + typeof dynsroot + ' found');
        
        // list of dynamically serviceable pages and the path to webroot directory
        this.webroot = webroot;
        this.dynpages = dynpages;
        this.dynsroot = dynsroot;
    }
    serve(req, res, cookies, body) {
        var parsedUrl = url.parse(req.url);
        // in case of alias
        if(this.dynpages[parsedUrl.pathname].alias !== undefined) {
            // original file path that has been aliased
            parsedUrl.pathname = this.dynpages[parsedUrl.pathname].alias;
            // modify url path
            req.url = parsedUrl.format();
            // recurse to serve the aliased file
            this.serve(req, res, cookies, body);
        }
        // in case of not an alias, serve a file
        else {
            var dynFilePath = this.dynpages[parsedUrl.pathname].dynvalues;
            var dynPageEncoding = this.dynpages[parsedUrl.pathname].encoding;
            
            fs.readFile(this.webroot + parsedUrl.pathname, dynPageEncoding, (err, data) => {
                if(err) throw new Error("Could not read file" + this.webroot + parsedUrl.pathname + ".\n" + err.message);

                var httpHeaders = {
                    "Content-Type": this.dynpages[parsedUrl.pathname].type
                };

                var dataAndOptions = {
                    fileData: data,
                    fileEncoding: dynPageEncoding,
                    httpHeaders: httpHeaders,
                    cookies: cookies,
                    httpBody: body,
                    dynPage: this.dynpages[parsedUrl.pathname]
                }

                var page = require(this.dynsroot + '/' + dynFilePath).servePage(req, res, dataAndOptions);
            });
        }
    }
}

// expose the class
exports.Server = DynamicServer;