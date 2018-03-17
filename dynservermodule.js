'use strict';

var url = require('url');
var fs = require('fs');

var htmldyn = require('./htmldynmodule.js');

class DynamicServer {
    constructor(webroot, dynPages) {
        if(typeof webroot !== 'string') throw new TypeError('first argument "webroot" must be of type string, ' + typeof webroot + ' found');
        if(typeof dynPages !== 'object') throw new TypeError('second argument "dynPages" must be of type object, ' + typeof dynPages + ' found');
        this.dynPages = dynPages;
        this.webroot = webroot;
    }
    serve(req, res) {
        var parsedUrl = url.parse(req.url);
        // in case of file alias
        if(this.dynPages[parsedUrl.pathname].alias !== undefined) {
            parsedUrl.pathname = this.dynPages[parsedUrl.pathname].alias;
            req.url = parsedUrl.format();
            this.serve(req, res);
        }
        // serve a file
        else {
            var dynFilePath = this.dynPages[parsedUrl.pathname].dynvalues;
            var values = require(__dirname + '/' + dynFilePath).values;
            fs.readFile(this.webroot + parsedUrl.pathname, this.dynPages[parsedUrl.pathname].encoding, (err, data) => {
                if(err) throw new Error("Could not read file" + webroot + parsedUrl.pathname + ".\n" + err.message);

                res.writeHead(200, {"Content-Type": this.dynPages[parsedUrl.pathname].type});
                res.end(htmldyn.getHtmlStringWithIdValues(data, values), this.dynPages[parsedUrl.pathname].encoding);
            });
        }
    }
}

exports.Server = DynamicServer;