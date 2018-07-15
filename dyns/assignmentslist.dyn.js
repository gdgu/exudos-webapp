var events = require('events')

var auth = require('./auth')

var htmldynmodule = require('../lib/htmldyn/htmldynmodule')

var blCourses = require('../lib/bl/courses')
var blAssignments = require('../lib/bl/assignments')
var blIdNames = require('../lib/bl/idnames')

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
            multipleAssignments(courses, (assignments) => {
                multipleIdNames(assignments, (assignments) => {
                    res.end(JSON.stringify(assignments.map((assignment) => {
                        delete assignment._id
                        delete assignment.document
                        return assignment
                    })), 'utf8')
                })
            })
        })
    })

}

var multipleIdNames = (objects, callback) => {

    if(objects.length == 0) {
        callback(objects)
        return
    }

    var tracker = new events.EventEmitter()
    tracker.soFar = 0

    tracker.on('add', () => {
        tracker.soFar += 1
        if(tracker.soFar == objects.length) {
            tracker.emit('end')
        }
    })

    tracker.on('end', () => {
        callback(objects)
    })

    for(let index = 0; index < objects.length; index++) {
        blIdNames.getIdName(objects[index]._id, (name) => {
            objects[index].name = name
            tracker.emit('add')
        })
    }
}

var multipleAssignments = (courses, callback) => {

    if(courses.length == 0) {
        callback([])
        return
    }

    var assignments = []

    var tracker = new events.EventEmitter()
    tracker.soFar = 0

    tracker.on('add', () => {
        tracker.soFar += 1
        if(tracker.soFar == courses.length) {
            tracker.emit('end')
        }
    })

    tracker.on('end', () => {
        callback(assignments)
    })

    for(let index = 0; index < courses.length; index++) {
        blAssignments.listAssignmentsByCourse(courses[index], (courseAssignments) => {
            courseAssignments = courseAssignments.map((assignment) => {
                assignment.course = courses[index].code
                return assignment
            })
            assignments = assignments.concat(courseAssignments)
            tracker.emit('add')
        })
    }
}