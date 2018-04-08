var fs = require('fs');

exports.makeValues = (req, res, cookies, data) => {
    var values = JSON.parse(fs.readFileSync('dyns/globalvars.json', 'utf8'));

    return values;
}
