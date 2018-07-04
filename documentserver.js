var url = require('url')

var blDocuments = require('./lib/bl/documents')

exports.servePage = (request, response, callbackOnError) => {
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
            var err = new Error('document not found in database')
            if(callbackOnError !== undefined) callbackOnError(err)
            else throw err
        }
    })
}