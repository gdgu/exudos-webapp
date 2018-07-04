var fs = require('fs');
var url = require('url');

var htmldynmodule = require('../lib/htmldyn/htmldynmodule');
var bodyparsermodule = require('../lib/htmldyn/bodyparsermodule');

const errorMessages = {
    '404': 'This is not the file that you are looking for.',
    '403': 'You are not allowed to access this resource.',
    '0': 'No error occured.'
}

exports.servePage = (req, res, options, body) => {

    var getParams = bodyparsermodule.parseHttpBody(url.parse(req.url).query);

    var errorCode = ((getParams['errorCode'] !== undefined) ? getParams['errorCode'] : '0') || '0'

    var error = {
        code: parseInt(errorCode),
        message: errorMessages[errorCode]
    }

    // fall through
    if(errorMessages[errorCode] == undefined) {
        error = {
            code: 0,
            message: errorMessages['0']
        }
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
