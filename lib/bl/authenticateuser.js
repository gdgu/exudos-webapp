var crypto = require('crypto');

// hashing type is RSA-SHA
const hashType = 'RSA-SHA';

exports.authenticate = (lTokenA, lTokenB, callback) => {
    console.log(lTokenA, lTokenB);

    var passwordHash = crypto.createHash(hashType);
    passwordHash.update('abcd123');

    var userPassword = passwordHash.digest('hex');

    if(lTokenA === 'test.student' && lTokenB === userPassword) {
        callback(true);
    }
    else {
        callback(false);
    }
};