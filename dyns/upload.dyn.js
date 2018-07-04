var mimeTypes = require('mime-types')

var auth = require('./auth')
var bodyparsermodule = require('../lib/htmldyn/bodyparsermodule');

var blDocuments = require('../lib/bl/documents')

var Document = require('../lib/models/Document')

exports.filePath = ''

exports.servePage = (req, res, body) => {
    auth.postAuth(req, res, (currentUser, userType) => {
        var postParams = bodyparsermodule.parseHttpBody(body)
        console.log(postParams)

        var blob = postParams['blob']

        var matches = blob.match(/data:(.+\/.+);base64,(.*)/)

        var document = new Document(Buffer.from(matches[2], 'base64'), matches[1])
        var extension = mimeTypes.extension(document.mimeType)

        blDocuments.addDocument(document, (flag, idString) => {
            res.writeHead(200, {
                'Content-Type': 'text/plain'
            })

            if(flag) {
                res.end('_' + idString + '.' + extension)
            }
            else {
                res.end('failed upload', idString)
            }
        })
    })
}