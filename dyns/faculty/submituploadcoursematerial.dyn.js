const userType = 'faculty'

var fs = require('fs')
var events = require('events')

var auth = require('../auth')
var wrongUserType = require('../wrongusertype')

var bodyparsermodule = require('../../lib/htmldyn/bodyparsermodule')

var blCourses = require('../../lib/bl/courses')
var blDocuments = require('../../lib/bl/documents')

var CourseMaterial = require('../../lib/models/CourseMaterial')
var Document = require('../../lib/models/Document')

exports.filePath = ''

exports.servePage = (req, res, body) => {

    auth.postAuth(req, res, (currentUser, currentUserType) => {

        if(userType !== currentUserType) {

            wrongUserType.servePage(req, res)

            return
        }

        var postParams = bodyparsermodule.parseHttpBody(body);
        var page = new events.EventEmitter()
        page.on('failed', () => {
            res.writeHead(302, {
                'Content-Type': 'text/plain',
                'Location': 'uploadcoursematerial.html?failed'
            })
            res.end('form submission failed, redirection issued')
        })
        page.on('success', () => {
            res.writeHead(302, {
                'Content-Type': 'text/plain',
                'Location': 'uploadcoursematerial.html?success'
            })
            res.end('form submission successful, redirection issued')
        })

        var dataUrlRegex = /data:(.+\/.+);base64,(.*)/
        
        if(postParams['code'] == null || postParams['code'] == '' || postParams['blob'] == null || postParams['blob'] == '') {
            page.emit('failed')
        }

        else if(postParams['blob'].match(dataUrlRegex) == null) {
            page.emit('failed')
        }

        else {

            var courseCode = postParams['code']
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
                            var courseMaterial = new CourseMaterial(documentId, new Date(), courseObjectId, currentUser[userType])
                            blCourses.createCourseMaterial(courseMaterial, (flag) => {
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