var fs = require('fs');

exports.values = JSON.parse(fs.readFileSync('globalvars.json', 'utf8'));