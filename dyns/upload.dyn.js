var querystring = require('querystring')
var mimeTypes = require('mime-types')

var auth = require('./auth')

var blDocuments = require('../lib/bl/documents')

var Document = require('../lib/models/Document')

exports.filePath = ''

exports.servePage = (req, res, body) => {
    auth.postAuth(req, res, (currentUser, userType) => {
        var postParams = querystring.parse(body)

        var blob = postParams['blob']

        var matches = blob.match(/data:(.+\/.+);base64,(.*)/)

        var document = new Document(Buffer.from(matches[2], 'base64'), matches[1])
        var extension = mimeTypes.extension(document.mimeType)

        blDocuments.addDocument(document, (flag, objectId) => {
            res.writeHead(302, {
                'Content-Type': 'text/plain'
            })

            if(flag) {
                res.writeHead(302, {
                    'Location': '/documents/uploadedFile_' + objectId + '.' + extension
                })
                res.end('_' + objectId + '.' + extension)
            }
            else {
                res.end('failed upload', objectId)
            }
        })
    })
}