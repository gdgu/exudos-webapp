const userType = 'student'

var fs = require('fs')
var events = require('events')
var querystring = require('querystring')

var auth = require('../auth')
var wrongUserType = require('../wrongusertype')

var blAssignments = require('../../lib/bl/assignments')
var blIdNames = require('../../lib/bl/idnames')
var blDocuments = require('../../lib/bl/documents')

var AssignmentSubmission = require('../../lib/models/AssignmentSubmission')
var Document = require('../../lib/models/Document')

exports.filePath = ''

exports.servePage = (req, res, body) => {

    auth.postAuth(req, res, (currentUser, currentUserType) => {

        if(userType !== currentUserType) {

            wrongUserType.servePage(req, res)

            return
        }

        var postParams = querystring.parse(body);

        var page = new events.EventEmitter()
        page.on('failed', () => {
            res.writeHead(302, {
                'Content-Type': 'text/plain',
                'Location': 'submitassignment.html?failed'
            })
            res.end('form submission failed, redirection issued')
        })
        page.on('success', () => {
            res.writeHead(302, {
                'Content-Type': 'text/plain',
                'Location': 'submitassignment.html?success'
            })
            res.end('form submission successful, redirection issued')
        })

        var dataUrlRegex = /data:(.+\/.+);base64,(.*)/
        
        if(postParams['id'] == null || postParams['id'] == '' || postParams['blob'] == null || postParams['blob'] == '') {
            page.emit('failed')
        }

        else if(postParams['blob'].match(dataUrlRegex) == null) {
            page.emit('failed')
        }

        else {

            var assignmentIdName = postParams['id']
            var documentDataMatches = postParams['blob'].match(dataUrlRegex)

            blIdNames.getObjectId(assignmentIdName, (assignmentObjectId) => {

                if(assignmentObjectId == null) {
                    page.emit('failed')
                }

                else {
                    var document = new Document(Buffer.from(documentDataMatches[2], 'base64'), documentDataMatches[1])

                    blDocuments.addDocument(document, (flag, documentId) => {
                        if(!flag) {
                            page.emit('failed')
                        }
                        else {
                            var assignmentSubmission = new AssignmentSubmission(assignmentObjectId, documentId, new Date(), currentUser[userType])
                            blAssignments.submitAssignment(assignmentSubmission, (flag) => {
                                if(!flag) {
                                    page.emit('failed')
                                }
                                else {
                                    page.emit('success')
                                }
                            })
                        }
                    })
                }
            })
        }
    })
}