var fs = require('fs')

exports.filePath = ''

exports.servePage = (req, res) => {
    var values = JSON.parse(fs.readFileSync('dyns/globalvars.json', 'utf8'));
    res.writeHead(301, {
        'Location': values['universitywebsite'],
        'Content-Type': 'text/plain'
    })
    res.end('This page has moved permanently to ' + values['universitywebsite'] + '.')
}