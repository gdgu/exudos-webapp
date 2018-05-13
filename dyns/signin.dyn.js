var cookie = require('cookie');
var crypto = require('crypto');

var bodyparsermodule = require('../lib/htmldyn/bodyparsermodule');

var authenticateUser = require('../lib/bl/authenticateuser');
var dbConnect = require('../lib/db/dbconnect');

const hashType = 'RSA-SHA';

exports.servePage = (req, res, options, body) => {
    // for http headers
    var httpHeaders = {
        'Content-Type': options.type
    };
    // parsing cookies
    var cookies = cookie.parse(
        (req.headers.cookie) ? req.headers.cookie : ''
    );

    var postParams = bodyparsermodule.parseHttpBody(body);
    console.log(postParams)

    var afterAuth = (flag, currentUser) => {
        if(flag) {
            var lTokenA = currentUser._id.toString();
            var lTokenB = currentUser.password;

            var lTokenCookieString = [
                cookie.serialize('lTokenA', lTokenA, {httpOnly: true, maxAge: 24 * 60 * 60 * 2}),
                cookie.serialize('lTokenB', lTokenB, {httpOnly: true, maxAge: 24 * 60 * 60 * 2}),                
            ];

            console.log(lTokenCookieString);
            
            res.writeHead(302, [
                ['Set-Cookie', lTokenCookieString[0]],
                ['Set-Cookie', lTokenCookieString[1]],
                ['Location', '/landing.do']
            ]);
            res.end('');
        }
        else {
            httpHeaders['Location'] = '/?invalidUser';
            res.writeHead(302, httpHeaders);
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

                    authenticateUser.authenticate(id, password, afterAuth);
                }
                else {
                    afterAuth(false);
                }
            });
        }
        dbConnect(dbTaskToGetUserId);
    }

    else {
        httpHeaders['Location'] = '/?invalidUser';
        res.writeHead(302, httpHeaders);
        res.end('');
    }
}