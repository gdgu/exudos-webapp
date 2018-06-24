var url = require('url')
var path = require('path')

var blDocuments = require('./lib/bl/documents')

exports.servePage = (request, response, errDynOptions) => {
    var parsedUrl = url.parse(request.url)

    var requestedObjectIdString = parsedUrl.pathname.substring(parsedUrl.pathname.lastIndexOf('_') + 1, parsedUrl.pathname.lastIndexOf('.'))

    blDocuments.getDocument(requestedObjectIdString, (flag, documentObject) => {
        if(flag) {
            response.writeHead(200, {
                'Content-Type': documentObject.mimeType,
                'Content-Length': documentObject.content.length
            })
            response.end(documentObject.content, 'utf8')
        }
        else {
            var errorDescription = {
                code: 404,
                message: 'This is not the document that you\'re looking for.'
            }
            var page = require(
                path.normalize(__dirname + '/' + errDynOptions.dyn)
            ).servePage(request, response, errDynOptions, '', errorDescription);
        }
    })
}