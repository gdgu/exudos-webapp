var events = require('events')

var auth = require('./auth')

var htmldynmodule = require('../lib/htmldyn/htmldynmodule')

var blCourses = require('../lib/bl/courses')

exports.filePath = ''

exports.servePage = (req, res) => {

    auth.postAuth(req, res, (currentUser, currentUserType) => {

        switch(currentUserType) {
            case 'student':
            blCourses.listCourses = blCourses.listCoursesForStudent
            break
            case 'faculty':
            blCourses.listCourses = blCourses.listCoursesForFaculty
            break
        }

        res.writeHead(200, {
            'Content-Type': 'application/json'
        })

        blCourses.listCourses({_id: currentUser[currentUserType]}, (courses) => {
            res.end(JSON.stringify(courses.map((course) => { 
                delete course._id
                delete course.taughtBy
                delete course.programme
                return course 
            })), 'utf8')
        })
    })

}