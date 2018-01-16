var htmldyn = require('./htmldynmodule.js');

var head = htmldyn.getHtmlTagString('head', [
    htmldyn.getHtmlTagString('meta', '', '', '', {name: 'viewport', content: 'width=device-width'}),
    htmldyn.getHtmlTagString('title', 'My Page'),
].join(' '));
var body = htmldyn.getHtmlTagString('body', 
    htmldyn.getHtmlTagString('table', 
        htmldyn.getHtmlTagString('tr', 
            [
                htmldyn.getHtmlTagString('td',
                    htmldyn.getHtmlTagString('p', 'para1', 'cpara'),
                        'ccol'),
                htmldyn.getHtmlTagString('td',
                    htmldyn.getHtmlTagString('p', 'para2', 'cpara'),
                        'ccol')
            ].join(' '),
        'crow')), 
'ctable');
exports.html = htmldyn.getHtmlTagString('html', head + body, '', '', {lang: 'en'});