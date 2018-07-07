const userType = 'student'

var fs = require('fs')
var events = require('events')

var auth = require('../auth')
var wrongUserType = require('../wrongusertype')

var htmldynmodule = require('../../lib/htmldyn/htmldynmodule')

var blNotices = require('../../lib/bl/notices')
var blCourses = require('../../lib/bl/courses')

exports.filePath = ''

exports.servePage = (req, res) => {

    var filePath = exports.filePath

    auth.postAuth(req, res, (currentUser, currentUserType) => {

        if(userType !== currentUserType) {

            wrongUserType.servePage(req, res)

            return
        }

        var values = JSON.parse(fs.readFileSync('dyns/globalvars.json', 'utf8'));

        values.username = currentUser.username
        values.usertype = userType
        values.pagetitle = "Notices"

        res.writeHead(200, {
            'Content-Type': 'text/html'
        })

        fs.readFile(__dirname + '/template.html', 'utf8', (err, templateHtml) => {
            fs.readFile(filePath, 'utf8', (err, viewHtml) => {
                values.content = viewHtml

                var contentHtml = htmldynmodule.getHtmlStringWithIdValues(templateHtml, values)

                var notices = []

                var fetchNotices = (callback) => {

                    var notices = []
                
                    var tracker = new events.EventEmitter()
                    tracker.schoolNoticesDone = false
                    tracker.coursesNoticesDone = 0
                
                    blCourses.listCoursesForStudent({_id: currentUser[userType]}, (courses) => {
                        tracker.coursesLength = courses.length
                
                        for(let course of courses) {
                            blNotices.listNoticesByCourse(course, (courseNotices) => {
                                courseNotices = courseNotices.map((notice) => {
                                    notice.course = course.code
                                    return notice
                                })
                                notices = notices.concat(courseNotices)
                                
                                tracker.emit('addCourse')
                            })
                        }
                    })
                
                    // WARNING : requires revision (hard coded object)
                    var school = {name: "Management"}
                    blNotices.listNoticesBySchool(school, (schoolNotices) => {
                        schoolNotices = schoolNotices.map((notice) => {
                            notice.school = `School of ${school.name}`
                            return notice
                        })
                        notices = notices.concat(schoolNotices)
                
                        tracker.emit('endSchool')
                    })
                
                    tracker.on('addCourse', () => {
                        tracker.coursesNoticesDone += 1
                        if(tracker.coursesNoticesDone == tracker.coursesLength) {
                            tracker.emit('endCourses')
                        }
                    })
                
                    tracker.on('endCourses', () => {
                        tracker.courseNoticesDone = true
                
                        if(tracker.courseNoticesDone && tracker.schoolNoticesDone) {
                            tracker.emit('endAll')
                        }
                    })
                
                    tracker.on('endSchool', () => {
                        tracker.schoolNoticesDone = true
                
                        if(tracker.courseNoticesDone && tracker.schoolNoticesDone) {
                            tracker.emit('endAll')
                        }
                    })
                
                    tracker.on('endAll', () => {
                        callback(notices)
                    })
                }
                
                fetchNotices((notices) => {
                    values.table = makeTable(notices)

                    res.end(htmldynmodule.getHtmlStringWithIdValues(contentHtml, values))
                })
                
            })
        })

    })
}

var makeTable = (notices) => {
    var html = ''

    for(var notice of notices) {

        var eleSmall = htmldynmodule.getHtmlTagString('small', `${new Date(notice.dateTime).toLocaleString()}`, 'code')
        var eleTdTitle = htmldynmodule.getHtmlTagString('td', `posted for ${((notice.school != undefined) ? '🏫 ' + notice.school : '📒 ' + notice.course)} ${eleSmall}`, 'title')
        var eleTdContent = htmldynmodule.getHtmlTagString('td', `${notice.content}`, 'content')

        var eleTr = htmldynmodule.getHtmlTagString('tr', eleTdTitle + eleTdContent, 'card')

        html += eleTr
    }

    return html
}