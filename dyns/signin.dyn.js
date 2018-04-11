var fs = require('fs');
var cookie = require('cookie');
var crypto = require('crypto');
var htmldynmodule = require('../lib/htmldyn/htmldynmodule');
var bodyparsermodule = require('../lib/htmldyn/bodyparsermodule');
var authenticateUser = require('../lib/bl/authenticateuser');
var dbConnect = require('../lib/db/dbconnect');

const hashType = 'RSA-SHA';

exports.servePage = (req, res, dataAndOptions) => {
    var cookies = dataAndOptions.cookies;
    var values = JSON.parse(fs.readFileSync('dyns/globalvars.json', 'utf8'));

    var postParams = bodyparsermodule.parseHttpBody(dataAndOptions.httpBody);
    console.log(postParams)

    var callback1 = (flag, currentUser) => {
        if(flag) {
            var lTokenA = currentUser._id.toString();
            var lTokenB = currentUser.password;

            var lTokenCookieString = [
                cookie.serialize('lTokenA', lTokenA, {httpOnly: true, maxAge: 24 * 60 * 60}),
                cookie.serialize('lTokenB', lTokenB, {httpOnly: true, maxAge: 24 * 60 * 60}),                
            ];

            console.log(lTokenCookieString);

            res.writeHead(302, [
                ['Set-Cookie', lTokenCookieString[0]],
                ['Set-Cookie', lTokenCookieString[1]],
                ['Location', '/login.html']
            ]);
            res.end('');
        }
        else {
            dataAndOptions.httpHeaders['Location'] = '/';
            res.writeHead(302, dataAndOptions.httpHeaders);
            res.end('');
        }
    }

    if(postParams['username'] !== undefined && postParams['password'] !== undefined) {
        // get user's id based on username
        var dbTaskToGetUserId = (err, dbL) => {
            var db = dbL.db();
            db.collection('users').findOne({username: postParams['username']}, (err, res) => {
                if(res !== undefined && res !== null) {
                    var id = res._id.toString();
                    // get password hash for given string
                    var passwordHash = crypto.createHash(hashType)
                    passwordHash.update(postParams['password']);
                    var password = passwordHash.digest('hex');

                    authenticateUser.authenticate(id, password, callback1);
                }
                else {
                    callback1(false);
                }
            });
        }
        dbConnect(dbTaskToGetUserId);
    }

    else {
        dataAndOptions.httpHeaders['Location'] = '/';
        res.writeHead(302, dataAndOptions.httpHeaders);
        res.end('');
    }
}