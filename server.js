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

            res.end(htmldyn.getHtmlStringWithIdValues(data, {
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
        res.end('<!DOCTYPE html>' +
            htmldyn.getHtmlTagString('html', '\n' +
                htmldyn.getHtmlTagString('head',
                    [
                        htmldyn.getHtmlTagString('meta', undefined, undefined, undefined, {
                            name: 'viewport',
                            content: 'width=device-width'
                        }),
                        htmldyn.getHtmlTagString('meta', undefined, undefined, undefined, {
                            charset: 'utf8'
                        }),
                        htmldyn.getHtmlTagString('link', undefined, undefined, undefined, {
                            href: 'base.css',
                            rel: 'stylesheet',
                            type: 'text/css'
                        }),
                        htmldyn.getHtmlTagString('title', '404 | Error Page')
                    ].join('\n')
                ) +
                '\n' +
                htmldyn.getHtmlTagString('body', '\n' +
                    [
                        htmldyn.getHtmlTagString('h1', '404. Page not found. :()'),
                        htmldyn.getHtmlTagString('p',
                            [
                                'Oops! That\'s an error.',
                                htmldyn.getHtmlTagString('br'),
                                'This is not the page that you\'re looking for.'
                            ].join('\n')
                        )
                    ].join('\n')) +
                '\n',
            undefined, undefined, {
                lang: 'en'
            })
        );
    }
});

// define server port
const port = process.env.PORT || 5000;

// make server listen to port
server.listen(port);
console.log('Started server at port ' + port);
