var fs = require('fs');
var htmldynmodule = require('../lib/htmldyn/htmldynmodule');
var bodyparsermodule = require('../lib/htmldyn/bodyparsermodule');
var url = require('url');

exports.servePage = (req, res, dataAndOptions) => {
    var values = JSON.parse(fs.readFileSync('dyns/globalvars.json', 'utf8'));
    var getParamas = bodyparsermodule.parseHttpBody(url.parse(req.url).query);

    if(getParamas['invalidUser'] !== undefined) {
        values.errorMsg = '! error : invalid username or password';
    }
    else if(getParamas['signedOut'] !== undefined) {
        values.errorMsg = 'you\'ve been signed out :)';
    }
    else if(getParamas['signinFirst'] !== undefined) {
        values.errorMsg = 'please signin first !';
    }
    else {
        values.errorMsg = '';
    }

    res.writeHead(200, dataAndOptions.httpHeaders);
    res.end(htmldynmodule.getHtmlStringWithIdValues(dataAndOptions.fileData, values), dataAndOptions.fileEncoding);
}
