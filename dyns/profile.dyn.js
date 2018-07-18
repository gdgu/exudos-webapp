var fs = require('fs')
var events = require('events')

var auth = require('./auth')

var htmldynmodule = require('../lib/htmldyn/htmldynmodule')

exports.filePath = ''

exports.servePage = (req, res) => {

    var filePath = exports.filePath

    auth.postAuth(req, res, (currentUser, currentUserType) => {

        var values = JSON.parse(fs.readFileSync('dyns/globalvars.json', 'utf8'));

        switch(currentUserType) {
            case 'student':
            break
            case 'faculty':
            break
        }

        values.username = currentUser.username
        values.usertype = currentUserType
        values.pagetitle = "Notices"

        res.writeHead(200, {
            'Content-Type': 'text/html'
        })

        fs.readFile(__dirname + `/${currentUserType}/template.html`, 'utf8', (err, templateHtml) => {
            fs.readFile(filePath, 'utf8', (err, viewHtml) => {
                
                values.content = viewHtml
                
                var contentHtml = htmldynmodule.getHtmlStringWithIdValues(templateHtml, values)

                res.end(htmldynmodule.getHtmlStringWithIdValues(contentHtml, values))
                
            })
        })

    })
}
