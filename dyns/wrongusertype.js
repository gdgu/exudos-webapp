var fs = require('fs')

var errorPage = require('./error.dyn')

exports.servePage = (req, res, body) => {
    req.url = '/error.html?errorCode=403'
    errorPage.servePage(req, res, body)
}