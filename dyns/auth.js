var cookie = require('cookie')

var authenticateUser = require('../lib/bl/authenticateuser')

exports.postAuth = (req, res, callback) => {
    
    var cookies = cookie.parse(
        (req.headers.cookie) ? req.headers.cookie : ''
    )

    var lTokenA = cookies['lTokenA']
    var lTokenB = cookies['lTokenB']

    if(lTokenA !== undefined && lTokenB !== undefined) {
        authenticateUser.authenticate(lTokenA, lTokenB, (flag, currentUser) => {
            if(flag) {

                let userType = (currentUser.faculty !== undefined) ? 'faculty' : (
                    (currentUser.student !== undefined) ? 'student' : undefined
                )

                callback(currentUser, userType);
            }
            
            else {
                var httpHeaders = {
                    'Location': '/?signinFirst'
                }
                res.writeHead(302, httpHeaders)
                res.end('')
            }
        })
    }
    else {
        var httpHeaders = {
            'Location': '/?signinFirst'
        }
        res.writeHead(302, httpHeaders)
        res.end('')
    }
}