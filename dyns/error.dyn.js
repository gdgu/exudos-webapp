var fs = require('fs');

var htmldynmodule = require('../lib/htmldyn/htmldynmodule');

exports.servePage = (req, res, options, body, error) => {

    // fall through
    if(error == undefined) error = {
        message: 'No error occured.',
        code: 0
    }

    // custom set of default values used by all pages
    var values = JSON.parse(fs.readFileSync('dyns/globalvars.json', 'utf8'));
    values.errormessage = error.message
    values.errorcode = error.code

    var httpStatusCode = (error.code == 0) ? 200 : error.code

    res.writeHead(httpStatusCode, {
        'Content-Type': options.type
    });
    
    fs.readFile(options.filepath, options.encoding, (err, data) => {
        res.end(htmldynmodule.getHtmlStringWithIdValues(data, values), options.encoding);
    });
}
