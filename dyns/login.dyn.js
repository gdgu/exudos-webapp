var fs = require('fs');

exports.values = JSON.parse(fs.readFileSync('dyns/globalvars.json', 'utf8'));

exports.values.username = 'test.student';
exports.values.userFullName = 'John Smith';
