var fs = require('fs');
var htmldynmodule = require('../lib/htmldyn/htmldynmodule');

exports.servePage = (req, res, dataAndOptions) => {
    var values = JSON.parse(fs.readFileSync('dyns/globalvars.json', 'utf8'));

    res.writeHead(200, dataAndOptions.httpHeaders);
    res.end(htmldynmodule.getHtmlStringWithIdValues(dataAndOptions.fileData, values), dataAndOptions.fileEncoding);
}
