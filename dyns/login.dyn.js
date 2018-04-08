var fs = require('fs');

exports.makeValues = (req, res, cookies, data) => {
    var values = JSON.parse(fs.readFileSync('dyns/globalvars.json', 'utf8'));
    values.username = 'test.student';
    values.userFullName = 'John Smith';

    return values;
}


