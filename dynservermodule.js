'use strict';

// import required modules
var url = require('url');
var fs = require('fs');

var htmldyn = require('./htmldynmodule.js');

class DynamicServer {
    constructor(webroot, dynPages) {
        // type errors
        if(typeof webroot !== 'string') throw new TypeError('first argument "webroot" must be of type string, ' + typeof webroot + ' found');
        if(typeof dynPages !== 'object') throw new TypeError('second argument "dynPages" must be of type object, ' + typeof dynPages + ' found');
        // list of dynamically serviceable pages and the path to webroot directory
        this.dynPages = dynPages;
        this.webroot = webroot;
    }
    serve(req, res) {
        var parsedUrl = url.parse(req.url);
        // in case of alias
        if(this.dynPages[parsedUrl.pathname].alias !== undefined) {
            // original file path that has been aliased
            parsedUrl.pathname = this.dynPages[parsedUrl.pathname].alias;
            // modify url path
            req.url = parsedUrl.format();
            // recurse to serve the aliased file
            this.serve(req, res);
        }
        // in case of not an alias, serve a file
        else {
            // path to the file containing dynamic values
            var dynFilePath = this.dynPages[parsedUrl.pathname].dynvalues;
            // fetch dynamic values
            var values = require(__dirname + '/' + dynFilePath).values;
            // read html content of file
            fs.readFile(this.webroot + parsedUrl.pathname, this.dynPages[parsedUrl.pathname].encoding, (err, data) => {
                // in case of error
                if(err) throw new Error("Could not read file" + webroot + parsedUrl.pathname + ".\n" + err.message);

                // pass the response by altering html data of file with the dynamic values using htmldyn
                res.writeHead(200, {"Content-Type": this.dynPages[parsedUrl.pathname].type});
                res.end(htmldyn.getHtmlStringWithIdValues(data, values), this.dynPages[parsedUrl.pathname].encoding);
            });
        }
    }
}

// expose the class
exports.Server = DynamicServer;