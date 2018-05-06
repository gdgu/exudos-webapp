var cookie = require('cookie');

const hashType = 'RSA-SHA';

exports.servePage = (req, res) => {

    var lTokenCookieString = [
        cookie.serialize('lTokenA', '', {httpOnly: true, maxAge: 0}),
        cookie.serialize('lTokenB', '', {httpOnly: true, maxAge: 0}),                
    ];

    console.log(lTokenCookieString);

    res.writeHead(302, [
        ['Set-Cookie', lTokenCookieString[0]],
        ['Set-Cookie', lTokenCookieString[1]],
        ['Location', '/?signedOut']
    ]);
    res.end('');
}