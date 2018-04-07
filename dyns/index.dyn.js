var fs = require('fs');

exports.values = JSON.parse(fs.readFileSync('dyns/globalvars.json', 'utf8'));
