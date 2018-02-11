var fs = require('fs');
var querystring = require('querystring');
var url = require('url');

var htmldyn = require('./htmldynmodule.js');

exports.serve = (webroot, htdocs) => {
    return (req, res) => {
        var pathname = url.parse(req.url).pathname;
        if(htdocs[pathname] !== undefined) {
            res.writeHead(200, {'Content-Type': htdocs[pathname].type});
            var filePath;
            if(htdocs[pathname].file === undefined) {
                filePath = webroot + pathname;
            }
            else {
                filePath = webroot + htdocs[pathname].file;
            }
            fs.readFile(filePath, htdocs[pathname].encoding, (err, data) => {
                if(err) throw err;

                if(htdocs[pathname].dynamic) {
                    var jsFilePath = filePath.substring(0, filePath.lastIndexOf('.')) + '.dyn.js';
                    var jsFileValues = require(jsFilePath).values;

                    res.end(htmldyn.getHtmlStringWithIdValues(data, jsFileValues), htdocs[pathname].encoding);
                }
                else {
                    res.end(data, htdocs[pathname].encoding);
                }
            });
        }
        else {
            req.url = '/404';
            exports.serve(webroot, htdocs)(req, res);
        }
    };
};
