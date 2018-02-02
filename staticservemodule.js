var fs = require('fs');
var querystring = require('querystring');
var url = require('url');

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
                res.end(data, htdocs[pathname].encoding);
            });
        }
        else {
            res.writeHead(404, {'Content-Type': htdocs['/404'].type});
            var filePath;
            filePath = webroot + htdocs['/404'].file;
            fs.readFile(filePath, htdocs['/404'].encoding, (err, data) => {
                if(err) throw err;
                res.end(data, htdocs['/404'].encoding);
            });
        }
    };
};
