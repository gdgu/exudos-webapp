var dbConnect = require('../db/dbconnect')
var coursesManip = require('../db/coursesmanip')
var Assignment = require('../models/Assignment')
var AssignmentSubmission = require('../models/AssignmentSubmission')

exports.createAssignment = (assignment, callback) => {
    dbConnect((err, dbL) => {
        var db = dbL.db()

        db.collection('assignments').insertOne(assignment, (err) => {

            dbL.close()

            if(err) {
                callback(false)
                return
            }
            callback(true)
        })
    })
}

exports.submitAssignment = (assignmentSubmission, callback) => {
    dbConnect((err, dbL) => {
        var db = dbL.db()

        db.collection('assignmentSubmissions').insertOne((err, res) => {

            dbL.close()

            if(err) {
                callback(false)
                return
            }
            callback(true)
        })
    })
}

exports.listAssignmentsByCourse = (course, callback) => {
    coursesManip.queryId(course, (courseObjectId) => {
        dbConnect((err, dbL) => {
            var db = dbL.db()

            db.collection('assignments').find({course: courseObjectId}, (err, res) => {

                dbL.close()

                if(err) {
                    callback(false)
                    return
                }
                callback(res)
            })
        })
    })
}
