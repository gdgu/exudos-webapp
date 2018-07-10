const userType = 'faculty'

var fs = require('fs')
var url = require('url')

var auth = require('../auth')
var wrongUserType = require('../wrongusertype')

var htmldynmodule = require('../../lib/htmldyn/htmldynmodule')
var bodyparsermodule = require('../../lib/htmldyn/bodyparsermodule')

exports.filePath = ''

exports.servePage = (req, res) => {

    var filePath = exports.filePath

    auth.postAuth(req, res, (currentUser, currentUserType) => {

        if(userType !== currentUserType) {

            wrongUserType.servePage(req, res)

            return
        }

        var values = JSON.parse(fs.readFileSync('dyns/globalvars.json', 'utf8'));

        var getParams = bodyparsermodule.parseHttpBody(url.parse(req.url).query);

        if(getParams['success'] !== undefined) {
            values.notification = '✅ assignment created';
        }
        else if(getParams['failed'] !== undefined) {
            values.notification = '❌ creation failed';
        }
        else {
            values.notification = '';
        }
        
        values.username = currentUser.username
        values.usertype = userType
        values.pagetitle = "Create An Assignment"

        res.writeHead(200, {
            'Content-Type': 'text/html'
        })

        fs.readFile(__dirname + '/template.html', 'utf8', (err, templateHtml) => {
            fs.readFile(filePath, 'utf8', (err, viewHtml) => {
                values.content = viewHtml

                var contentHtml = htmldynmodule.getHtmlStringWithIdValues(templateHtml, values)

                res.end(
                    htmldynmodule.getHtmlStringWithIdValues(contentHtml, values)
                )
            })
        })

    })
}