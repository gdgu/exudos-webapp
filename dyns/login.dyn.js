var fs = require('fs');
var cookie = require('cookie');
var htmldynmodule = require('../lib/htmldyn/htmldynmodule');

var authenticateUser = require('../lib/bl/authenticateuser');

exports.servePage = (req, res, dataAndOptions) => {
    var cookies = dataAndOptions.cookies;
    var values = JSON.parse(fs.readFileSync('dyns/globalvars.json', 'utf8'));

    var callback1 = (flag, currentUser) => {
        if(flag) {
            values.username = currentUser.username;        
            values.userFullName = currentUser.username;
        }
        else {
            values.username = 'NOUSER';
            values.userFullName = 'NO NAME AS WRONG LOGIN';
        }

        res.writeHead(200, dataAndOptions.httpHeaders);
        res.end(htmldynmodule.getHtmlStringWithIdValues(dataAndOptions.fileData, values), dataAndOptions.fileEncoding);
    }

    if(cookies['lTokenA'] !== undefined && cookies['lTokenB'] !== undefined) {
        authenticateUser.authenticate(cookies['lTokenA'], cookies['lTokenB'], callback1);
    }

    else {
        values.username = 'NOUSER';
        values.userFullName = 'NO NAME AS NO LOGIN';

        res.writeHead(200, dataAndOptions.httpHeaders);
        res.end(htmldynmodule.getHtmlStringWithIdValues(dataAndOptions.fileData, values), dataAndOptions.fileEncoding);
    }
}


