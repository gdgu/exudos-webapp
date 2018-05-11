const userType = 'student'

var fs = require('fs')

var auth = require('../auth.dyn')

var htmldynmodule = require('../../lib/htmldyn/htmldynmodule')

exports.servePage = (req, res, options) => {
    auth.postAuth(req, res, (currentUser, currentUserType) => {

        if(userType !== currentUserType) {

            res.writeHead(302, {
                'Location': '/landing.do'
            })
            res.end()
            
            return
        }

        var values = JSON.parse(fs.readFileSync('dyns/globalvars.json', 'utf8'));

        values.username = currentUser.username
        values.usertype = userType

        res.writeHead(200, {
            'Content-Type': options.type
        })

        fs.readFile(options.filepath, options.encoding, (err, data) => {
            res.end(
                htmldynmodule.getHtmlStringWithIdValues(data, values)
            )
        })

    })
}