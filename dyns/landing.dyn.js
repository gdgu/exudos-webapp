var fs = require('fs');
var cookie = require('cookie');
var htmldynmodule = require('../lib/htmldyn/htmldynmodule');

var authenticateUser = require('../lib/bl/authenticateuser');

exports.servePage = (req, res, dataAndOptions) => {
    var cookies = dataAndOptions.cookies;
    var values = JSON.parse(fs.readFileSync('dyns/globalvars.json', 'utf8'));

    var callback1 = (flag, currentUser) => {
        if(flag) {

            // true and authenticated yes case

            values.username = currentUser.username;

            if(currentUser.faculty !== undefined) {
                values.usertype = 'faculty';
            }
            else if(currentUser.student !== undefined) {
                values.usertype = 'student';
            }
            else {
                console.log("Error user type found in database!!");
            }

            res.writeHead(200, dataAndOptions.httpHeaders);
            res.end(htmldynmodule.getHtmlStringWithIdValues(dataAndOptions.fileData, values), dataAndOptions.fileEncoding);
        }
        else {
            dataAndOptions.httpHeaders['Location'] = '/?signinFirst';
            res.writeHead(302, dataAndOptions.httpHeaders);
            res.end('');
        }
    }

    if(cookies['lTokenA'] !== undefined && cookies['lTokenB'] !== undefined) {
        authenticateUser.authenticate(cookies['lTokenA'], cookies['lTokenB'], callback1);
    }

    else {
        dataAndOptions.httpHeaders['Location'] = '/?signinFirst';
        res.writeHead(302, dataAndOptions.httpHeaders);
        res.end('');
    }
}


