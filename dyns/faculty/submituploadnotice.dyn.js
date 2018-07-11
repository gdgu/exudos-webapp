const userType = 'faculty'

var fs = require('fs')
var querystring = require('querystring')
var events = require('events')

var auth = require('../auth')
var wrongUserType = require('../wrongusertype')

var blCourses = require('../../lib/bl/courses')
var blNotices = require('../../lib/bl/notices')

var Notice = require('../../lib/models/Notice')

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
                'Location': 'uploadnotice.html?failed'
            })
            res.end('form submission failed, redirection issued')
        })
        page.on('success', () => {
            res.writeHead(302, {
                'Content-Type': 'text/plain',
                'Location': 'uploadnotice.html?success'
            })
            res.end('form submission successful, redirection issued')
        })

        if(postParams['target'] == null || postParams['target'] == '' || postParams['content'] == null || postParams['content'] == '') {
            page.emit('failed')
        }
        
        else if(postParams['target'] != 'school' && postParams['target'] != 'course') {
            page.emit('failed')
        }

        else if(postParams['target'] == 'school' && (postParams['name'] == '' || postParams['name'] == null)) {
            page.emit('failed')
        }

        else if(postParams['target'] == 'course' && (postParams['code'] == '' || postParams['code'] == null)) {
            page.emit('failed')
        }

        else {
            var target = postParams['target']

            if(target == 'school') {
                var schoolName = postParams['name']
                // WARNING: requires revision, use htmlspecialchars like function here to protect from XSS
                var content = postParams['content']

                // WARNING : requires revision (hard coded object)
                var notice = new Notice(new Date(), content, {_id: new (require('mongodb')).ObjectId("5ace2636b0b7c599bac20e11")})
                blNotices.createNotice(notice, (flag) => {
                    if(flag) {
                        page.emit('success')
                    }
                    else {
                        page.emit('failed')
                    }
                })
            }

            else if(target == 'course') {
                var courseCode = postParams['code']
                // WARNING: requires revision, use htmlspecialchars like function here to protect from XSS
                var content = postParams['content']

                blCourses.getCourseObjectId({code: courseCode}, (courseObjectId) => {

                    if(courseObjectId == null) {
                        page.emit('failed')
                    }

                    else {
                        var notice = new Notice(new Date(), content, undefined, courseObjectId)
                        blNotices.createNotice(notice, (flag) => {
                            if(flag) {
                                page.emit('success')
                            }
                            else {
                                page.emit('failed')
                            }
                        })
                    }
                })
            }

        }
    })
}