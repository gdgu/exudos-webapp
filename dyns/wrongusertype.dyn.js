var fs = require('fs')

var errorPage = require('./error.dyn')

exports.servePage = (req, res) => {
    errorPage.servePage(req, res, JSON.parse(fs.readFileSync('dyns/dynhtdocs.json', 'utf8'))["/error.html"], '', {
        code: 403,
        message: 'Forbidden. You\'re not allowed to access this resource.'
    })
}