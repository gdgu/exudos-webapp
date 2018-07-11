const userType = 'faculty'

var fs = require('fs')
var querystring = require('querystring')
var events = require('events')

var auth = require('../auth')
var wrongUserType = require('../wrongusertype')

var blAssignments = require('../../lib/bl/assignments')
var blCourses = require('../../lib/bl/courses')
var blDocuments = require('../../lib/bl/documents')

var Assignment = require('../../lib/models/Assignment')
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
                'Location': 'createassignment.html?failed'
            })
            res.end('form submission failed, redirection issued')
        })
        page.on('success', () => {
            res.writeHead(302, {
                'Content-Type': 'text/plain',
                'Location': 'createassignment.html?success'
            })
            res.end('form submission successful, redirection issued')
        })

        var dataUrlRegex = /data:(.+\/.+);base64,(.*)/
        
        if(postParams['code'] == null || postParams['code'] == '' || postParams['blob'] == null || postParams['blob'] == '' ||  postParams['date'] == null || postParams['date'] == '') {
            page.emit('failed')
        }

        else if(postParams['blob'].match(dataUrlRegex) == null) {
            page.emit('failed')
        }

        else if(new Date(Date.parse(postParams['date'])).toString() == 'Invalid Date') {
            page.emit('failed')
        }

        else {

            var courseCode = postParams['code']
            var submitDate = new Date(postParams['date'])
            var documentDataMatches = postParams['blob'].match(dataUrlRegex)

            blCourses.getCourseObjectId({code: courseCode}, (courseObjectId) => {

                if(courseObjectId == null) {
                    page.emit('failed')
                }

                else {

                    var document = new Document(Buffer.from(documentDataMatches[2], 'base64'), documentDataMatches[1])
                    blDocuments.addDocument(document, (flag, documentId) => {
                        if(!flag) {
                            page.emit('failed')
                        }
                        else {
                            var assignment = new Assignment(courseObjectId, new Date(), submitDate, documentId)
                            blAssignments.createAssignment(assignment,  (flag) => {
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