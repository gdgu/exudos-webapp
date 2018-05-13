var fs = require('fs')

var auth = require('./auth')

var htmldynmodule = require('../lib/htmldyn/htmldynmodule')

exports.servePage = (req, res, options) => {
    auth.postAuth(req, res, (currentUser, userType) => {

        res.writeHead(302, {
            'Location': '/' + userType + '/'
        })
        res.end('')
    })
}