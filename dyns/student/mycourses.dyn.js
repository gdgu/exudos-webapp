const userType = 'student'

var fs = require('fs')

var auth = require('../auth')
var wrongUserType = require('../wrongusertype')

var htmldynmodule = require('../../lib/htmldyn/htmldynmodule')

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
        values.pagetitle = "My Courses"

        res.writeHead(200, {
            'Content-Type': 'text/html'
        })

        fs.readFile(__dirname + '/template.html', 'utf8', (err, templateHtml) => {
            fs.readFile(filePath, 'utf8', (err, viewHtml) => {
                values.content = viewHtml

                var contentHtml = htmldynmodule.getHtmlStringWithIdValues(templateHtml, values)

                blCourses.listCoursesForStudent({_id: currentUser.student}, (courses) => {
                    values.table = makeTable(courses)

                    res.end(
                        htmldynmodule.getHtmlStringWithIdValues(contentHtml, values)
                    )
                })
            })
        })

    })
}

var makeTable = (courses) => {
    var html = ''

    for(var course of courses) {
        var eleSmall = htmldynmodule.getHtmlTagString('small', `(${course.code}, ${course.credits} credits)`, 'code')
        var eleTdTitle = htmldynmodule.getHtmlTagString('td', `📒 ${course.name} ${eleSmall}`, 'title')
        var eleH3s = htmldynmodule.getHtmlTagString('h3', 'Course Material(s)') + htmldynmodule.getHtmlTagString('br') + htmldynmodule.getHtmlTagString('h3', 'Assignment(s)') + htmldynmodule.getHtmlTagString('br')
        var eleTdContent = htmldynmodule.getHtmlTagString('td', `${eleH3s}`, 'content')

        var eleTr = htmldynmodule.getHtmlTagString('tr', eleTdTitle + eleTdContent, 'card')

        html += eleTr
    }

    return html
}