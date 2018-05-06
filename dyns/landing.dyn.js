var fs = require('fs');
var cookie = require('cookie');
var htmldynmodule = require('../lib/htmldyn/htmldynmodule');

var authenticateUser = require('../lib/bl/authenticateuser');

exports.servePage = (req, res, options) => {

    // for http headers
    var httpHeaders = {
        'Content-Type': options.type
    };
    // parsing cookies
    var cookies = cookie.parse(
        (req.headers.cookie) ? req.headers.cookie : ''
    );
    // custom set of default values used by all pages
    var values = JSON.parse(fs.readFileSync('dyns/globalvars.json', 'utf8'));

    if(cookies['lTokenA'] !== undefined && cookies['lTokenB'] !== undefined) {
        authenticateUser.authenticate(cookies['lTokenA'], cookies['lTokenB'], (flag, currentUser) => {
            if(flag) {
                // true and authenticated yes case
                values.username = currentUser.username;
    
                // set the type of user
                if(currentUser.faculty !== undefined) {
                    values.usertype = 'faculty';
                }
                else if(currentUser.student !== undefined) {
                    values.usertype = 'student';
                }
                else {
                    console.log("Error user type found in database!!");
                }
    
                res.writeHead(200, httpHeaders);
                fs.readFile(options.filepath, options.encoding, (err, data) => {
                    res.end(htmldynmodule.getHtmlStringWithIdValues(data, values), options.encoding);
                });
            }
            else {
                httpHeaders['Location'] = '/?signinFirst';
                res.writeHead(302, httpHeaders);
                res.end('');
            }
        });
    }
    else {
        httpHeaders['Location'] = '/?signinFirst';
        res.writeHead(302, httpHeaders);
        res.end('');
    }
}


