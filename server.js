// import the required modules
var http = require('http');
var fs = require('fs');
// var static = require('node-static');
var querystring = require('querystring');

var htmldyn = require('./htmldynmodule.js');

// create the server
var server = http.createServer((req, res) => { 
    if(req.url == '/') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        
        fs.readFile('htdocs/index.html', 'utf8', (err, data) => {
            if(err) throw err;

            res.end(htmldyn.getHtmlStringWithIdentifierValues(data, {
                universityname: 'GD Goenka University'
            }));
        });
    }
    else if(req.url == '/base.css') {
        res.writeHead(200, {'Content-Type': 'text/css'});
        
        fs.readFile('htdocs/base.css', 'utf8', (err, data) => {
            if(err) throw err;

            res.end(data);
        });
    }
    else {
        res.writeHead(404, {'Content-Type': 'text/html'});
        res.end((() => 
            htmldyn.getHtmlTagString('html', '\n' + htmldyn.getHtmlTagString('head', [htmldyn.getHtmlTagString('meta', undefined, undefined, undefined, {
                name: 'viewport',
                content: 'width=device-width'
            }), htmldyn.getHtmlTagString('meta', undefined, undefined, undefined, {
                charset: 'utf8'
            }), htmldyn.getHtmlTagString('title', '404 | Error Page')].join('\n')) + '\n' + htmldyn.getHtmlTagString('body', '\n' + [htmldyn.getHtmlTagString('h1', '404 Error'), htmldyn.getHtmlTagString('p', 'This is not the page that you\'re looking for')].join('\n') + '\n') + '\n', undefined, undefined, {
                lang: 'en'
            })
        )());
    }
});

// define server port
const port = 8080;

// make server listen to port
server.listen(8080);
console.log('Started server at port ' + port);