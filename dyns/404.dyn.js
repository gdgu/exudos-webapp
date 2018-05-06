var fs = require('fs');
var htmldynmodule = require('../lib/htmldyn/htmldynmodule');
var bodyparsermodule = require('../lib/htmldyn/bodyparsermodule');
var url = require('url');

exports.servePage = (req, res, options) => {

    // custom set of default values used by all pages
    var values = JSON.parse(fs.readFileSync('dyns/globalvars.json', 'utf8'));

    res.writeHead(404, {
        'Content-Type': options.type
    });
    
    fs.readFile(options.filepath, options.encoding, (err, data) => {
        res.end(htmldynmodule.getHtmlStringWithIdValues(data, values), options.encoding);
    });
}
