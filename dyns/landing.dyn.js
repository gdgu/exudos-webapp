var fs = require('fs')

var auth = require('./auth.dyn')

var htmldynmodule = require('../lib/htmldyn/htmldynmodule')

exports.servePage = (req, res, options) => {
    auth.postAuth(req, res, (currentUser, userType) => {
        
        var httpHeaders = {
            'Location': '/' + userType + '/index.html'
        }

        res.writeHead(302, httpHeaders)
        res.end('')
    })
}