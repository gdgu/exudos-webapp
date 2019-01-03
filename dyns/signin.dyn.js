var querystring = require('querystring')
var cookie = require('cookie');
var crypto = require('crypto');

var authenticateUser = require('../lib/bl/authenticateuser');

const hashType = 'SHA256';

exports.filePath = ''

exports.servePage = (req, res, body) => {

    // for http headers
    var httpHeaders = {
        'Content-Type': 'text/plain'
    };
    // parsing cookies
    var cookies = cookie.parse(
        (req.headers.cookie) ? req.headers.cookie : ''
    );

    var postParams = querystring.parse(body);
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

        var username = postParams['username']
        var passwordHash = crypto.createHash(hashType)
        passwordHash.update(postParams['password']);
        var hashedPassword = passwordHash.digest('hex');

        authenticateUser.verifyCredentials(username, hashedPassword, afterAuth)
    }

    else {
        httpHeaders['Location'] = '/?invalidUser';
        res.writeHead(302, httpHeaders);
        res.end('');
    }
}