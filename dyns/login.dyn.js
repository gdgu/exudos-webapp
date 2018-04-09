var fs = require('fs');
var crypto = require('crypto');

// hashing type is RSA
const hashType = 'RSA-SHA';

exports.makeValues = (req, res, cookies, data) => {
    var values = JSON.parse(fs.readFileSync('dyns/globalvars.json', 'utf8'));

    if(cookies['lTokenA'] !== undefined && cookies['lTokenB'] !== undefined) {
        
        var passwordHash = crypto.createHash(hashType);
        passwordHash.update('abcd123');

        var userPassword = passwordHash.digest('hex');

        if(cookies['lTokenA'] === 'test.student' && cookies['lTokenB'] === userPassword) {
            values.username = 'test.student';
            values.userFullName = 'John Smith';
        }
    }

    else {       
        values.username = 'NOUSER';
        values.userFullName = 'NO NAME AS NO LOGIN';
    }

    return values;
}


