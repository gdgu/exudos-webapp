const userType = 'student'

var fs = require('fs')

var auth = require('../auth')
var wrongUserType = require('../wrongusertype')

var htmldynmodule = require('../../lib/htmldyn/htmldynmodule')

var blAssignments = require('../../lib/bl/assignments')
var blCourses = require('../../lib/bl/courses')

exports.filePath = ''

exports.servePage = (req, res, options) => {

    var filePath = exports.filePath

    auth.postAuth(req, res, (currentUser, currentUserType) => {

        if(userType !== currentUserType) {

            wrongUserType.servePage(req, res)

            return
        }

        var values = JSON.parse(fs.readFileSync('dyns/globalvars.json', 'utf8'));

        values.username = currentUser.username
        values.usertype = userType
        values.pagetitle = "List of Assignments"

        res.writeHead(200, {
            'Content-Type': 'text/html'
        })

        fs.readFile(__dirname + '/template.html', 'utf8', (err, templateHtml) => {
            fs.readFile(filePath, 'utf8', (err, viewHtml) => {
                values.content = viewHtml

                var contentHtml = htmldynmodule.getHtmlStringWithIdValues(templateHtml, values)

                var assignments = []

                blCourses.listCoursesForStudent({_id: currentUser[userType]}, (courses) => {
                    var index = 0
                    var repeater = (courseAssignments) => {
                        assignments = assignments.concat(courseAssignments)

                        if(index == courses.length) {
                            performLast()
                            return
                        }

                        blAssignments.listAssignmentsByCourse(courses[index++], repeater)
                    }
                    blAssignments.listAssignmentsByCourse(courses[index++], repeater)
                })

                var performLast = () => {

                    values.table = makeTable(assignments)

                    res.end(
                        htmldynmodule.getHtmlStringWithIdValues(contentHtml, values)
                    )
                }
            })
        })

    })
}

var makeTable = (assignments) => {
    var html = ''

    for(var assignment of assignments) {

        var eleSmall = htmldynmodule.getHtmlTagString('small', `(due: ${new Date(assignment.submitDate).toDateString()})`, 'code')
        var eleTdTitle = htmldynmodule.getHtmlTagString('td', `posted, 🗓 ${new Date(assignment.publishDate).toDateString()} ${eleSmall}`, 'title')
        var eleH3 = htmldynmodule.getHtmlTagString('h3', 'Assignment')

        var eleButton = htmldynmodule.getHtmlTagString('span', '📎 Open', 'downloadbutton')
        var eleAnchor = htmldynmodule.getHtmlTagString('a', eleButton, 'nouline defaultcolor', undefined, {
            href: '/documents/_' + assignment.document + '.document'
        })

        var eleTdContent = htmldynmodule.getHtmlTagString('td', `${eleH3} ${eleAnchor}`, 'content')

        var eleTr = htmldynmodule.getHtmlTagString('tr', eleTdTitle + eleTdContent, 'card')

        html += eleTr
    }

    return html
}