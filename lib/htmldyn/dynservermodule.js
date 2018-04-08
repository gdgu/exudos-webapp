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
            // path to the file containing dynamic values
            var dynFilePath = this.dynpages[parsedUrl.pathname].dynvalues;
            // fetch dynamic values
            var values = require(this.dynsroot + '/' + dynFilePath).makeValues(req, res, cookies, body);
            // read html content of file
            fs.readFile(this.webroot + parsedUrl.pathname, this.dynpages[parsedUrl.pathname].encoding, (err, data) => {
                // in case of error
                if(err) throw new Error("Could not read file" + webroot + parsedUrl.pathname + ".\n" + err.message);

                // pass the response by altering html data of file with the dynamic values using htmldyn
                res.writeHead(200, {"Content-Type": this.dynpages[parsedUrl.pathname].type});
                res.end(htmldyn.getHtmlStringWithIdValues(data, values), this.dynpages[parsedUrl.pathname].encoding);
            });
        }
    }
}

// expose the class
exports.Server = DynamicServer;