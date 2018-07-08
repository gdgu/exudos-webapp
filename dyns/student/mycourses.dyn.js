const userType = 'student'

var fs = require('fs')
var events = require('events')

var auth = require('../auth')
var wrongUserType = require('../wrongusertype')

var htmldynmodule = require('../../lib/htmldyn/htmldynmodule')

var blCourses = require('../../lib/bl/courses')
var blAssignments = require('../../lib/bl/assignments')
var blIdNames = require('../../lib/bl/idnames')

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
        values.pagetitle = "My Courses"

        res.writeHead(200, {
            'Content-Type': 'text/html'
        })

        fs.readFile(__dirname + '/template.html', 'utf8', (err, templateHtml) => {
            fs.readFile(filePath, 'utf8', (err, viewHtml) => {
                values.content = viewHtml

                var contentHtml = htmldynmodule.getHtmlStringWithIdValues(templateHtml, values)

                blCourses.listCoursesForStudent({_id: currentUser[userType]}, (courses) => {
                    
                    courseMaterialsAndAssignmentsRelated(courses, (courses) => {
                        values.table = makeTable(courses)
                        res.end(htmldynmodule.getHtmlStringWithIdValues(contentHtml, values))

                    })
                })
            })
        })

    })
}

var makeTable = (courses) => {
    var html = ''

    for(var course of courses) {
        var eleBr = htmldynmodule.getHtmlTagString('br')
        var eleSmall = htmldynmodule.getHtmlTagString('small', `(${course.code}, ${course.credits} credits)`, 'code')
        var eleTdTitle = htmldynmodule.getHtmlTagString('td', `📒 ${course.name} ${eleSmall}`, 'title')

        var eleCMs = []
        for(var courseMaterial of course.courseMaterials) {
            var eleCode = htmldynmodule.getHtmlTagString('code', `id: ${courseMaterial.name}`, 'id')
            var eleButton = htmldynmodule.getHtmlTagString('span', '📎 Open', 'downloadbutton')
            var eleAnchor = htmldynmodule.getHtmlTagString('a', eleButton, 'nouline defaultcolor', undefined, {
                href: '/documents/' + courseMaterial.name + 'CourseMaterial_' + courseMaterial.document + '.document'
            })
            eleCMs.push(eleCode + ' ' + eleAnchor)
        }
        if(eleCMs.length == 0) {
            eleCMs.push(htmldynmodule.getHtmlTagString('code', 'nil', 'id'))
        }
        eleCMs = eleCMs.join(',')

        var eleAs = []
        for(var assignment of course.assignments) {
            var eleCode = htmldynmodule.getHtmlTagString('code', `id: ${assignment.name}`, 'id')
            var eleButton = htmldynmodule.getHtmlTagString('span', '📎 Open', 'downloadbutton')
            var eleAnchor = htmldynmodule.getHtmlTagString('a', eleButton, 'nouline defaultcolor', undefined, {
                href: '/documents/' + assignment.name + 'Assignment_' + assignment.document + '.document'
            })
            eleAs.push(eleCode + ' ' + eleAnchor)
        }
        if(eleAs.length == 0) {
            eleAs.push(htmldynmodule.getHtmlTagString('code', 'nil', 'id'))
        }
        eleAs.join(',')

        var eleH3s = htmldynmodule.getHtmlTagString('h3', 'Course Material(s)') + eleCMs + eleBr + htmldynmodule.getHtmlTagString('h3', 'Assignment(s)') + eleAs + eleBr + eleBr
        var eleTdContent = htmldynmodule.getHtmlTagString('td', `${eleH3s} ${course.name} (${course.code}) is a ${course.credits} credit course that currently has listings for ${course.courseMaterials.length} course material(s) and ${course.assignments.length} assignment(s).`, 'content')

        var eleTr = htmldynmodule.getHtmlTagString('tr', eleTdTitle + eleTdContent, 'card')

        html += eleTr
    }

    return html
}

const and = (flagA, flagB) => flagA && flagB

var courseMaterialsAndAssignmentsRelated = (courses, callback) => {

    var tracker = new events.EventEmitter()
    tracker.soFar = []
    tracker.total = []
    tracker.done = []

    for(let index = 0; index < courses.length; index++) {

        tracker.soFar.push({
            courseMaterials: 0, assignments: 0
        })
        tracker.total.push({
            courseMaterials: 0, assignments: 0
        })
        tracker.done.push({
            courseMaterials: false, assignments: false
        })

        blCourses.listCourseMaterialByCourse(courses[index], (courseMaterials) => {
            tracker.total[index].courseMaterials = courseMaterials.length

            if(courseMaterials.length == 0) {
                tracker.done[index].courseMaterials = true
            }

            courses[index].courseMaterials = []
            for(let anotherIndex = 0; anotherIndex < courseMaterials.length; anotherIndex++) {
                blIdNames.getIdName(courseMaterials[anotherIndex], (name) => {
                    courseMaterials[anotherIndex].name = name
                    courses[index].courseMaterials.push(courseMaterials[anotherIndex])
                    tracker.emit('addCM', index)
                })
            }
        })

        blAssignments.listAssignmentsByCourse(courses[index], (assignments) => {
            tracker.total[index].assignments = assignments.length

            if(assignments.length == 0) {
                tracker.done[index].assignments = true
            }

            courses[index].assignments = []
            for(let anotherIndex = 0; anotherIndex < assignments.length; anotherIndex++) {
                blIdNames.getIdName(assignments[anotherIndex], (name) => {
                    assignments[anotherIndex].name = name
                    courses[index].assignments.push(assignments[anotherIndex])
                    tracker.emit('addA', index)
                })
            }

        })
    }

    tracker.on('addCM', (index) => {
        console.log('**addCM**', index)
        tracker.soFar[index].courseMaterials += 1
        if(tracker.soFar[index].courseMaterials == tracker.total[index].courseMaterials) {
            tracker.emit('doneCM', index)
        }
    })
    tracker.on('doneCM', (index) => {
        console.log('**doneCM**', index)
        tracker.done[index].courseMaterials = true

        tracker.emit('checkEnd')
    })

    tracker.on('addA', (index) => {
        console.log('**addA**', index)
        tracker.soFar[index].assignments += 1
        if(tracker.soFar[index].assignments == tracker.total[index].assignments){
            tracker.emit('doneA', index)
        }
    })
    tracker.on('doneA', (index) => {
        console.log('**doneA**', index)
        tracker.done[index].assignments = true

        tracker.emit('checkEnd')
    })

    tracker.on('checkEnd', () => {

        console.log('**checkEnd**', tracker.done)

        if(tracker.done.map((done) => {
            return Object.values(done).reduce(and)
        }).every((item) => item)) {
            tracker.emit('end')
        }
    })

    tracker.on('end', () => {
        callback(courses)
    })
}