const userType = 'student'

var fs = require('fs')

var auth = require('../auth')
var wrongUserType = require('../wrongusertype.dyn')

var htmldynmodule = require('../../lib/htmldyn/htmldynmodule')

exports.servePage = (req, res, options) => {
    auth.postAuth(req, res, (currentUser, currentUserType) => {

        if(userType !== currentUserType) {

            wrongUserType.servePage(req, res)
            
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