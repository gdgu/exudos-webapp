var dbConnect = require('../db/dbconnect')
var dbManip = require('../db/dbmanip')
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
    dbManip.queryId(course, 'courses', (courseObjectId) => {
        dbConnect((err, dbL) => {
            var db = dbL.db()

            db.collection('assignments').find({course: courseObjectId}).toArray((err, documents) => {

                dbL.close()

                if(err) {
                    callback(false)
                    return
                }
                callback(documents)
            })
        })
    })
}
