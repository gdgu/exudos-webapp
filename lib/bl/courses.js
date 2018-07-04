var dbConnect = require('../db/dbconnect')
var dbManip = require('../db/dbmanip')
var Course = require('../models/Course')
var CourseMaterial = require('../models/CourseMaterial')

exports.createCourseMaterial = (courseMaterial, callback) => {
    dbConnect((err, dbL) => {
        var db = dbL.db()

        db.collection('courseMaterials').insertOne(courseMaterial, (err) => {

            dbL.close()

            if(err) {
                callback(false)
                return
            }
            callback(true)
        })
    })
}

exports.listCourseMaterialByCourse = (course, callback) => {
    dbManip.queryId(course, 'courses', (courseObjectId) => {
        dbConnect((err, dbL) => {
            var db = dbL.db()

            db.collection('courseMaterials').find({course: courseObjectId}).toArray((err, documents) => {
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

exports.listCoursesForStudent = (student, callback) => {
    dbManip.queryId(student, 'students', (studentObjectId) => {
        dbConnect((err, dbL) => {
            var db = dbL.db()

            db.collection('students').findOne({_id: studentObjectId}, (err, student) => {
                if(err) {
                    dbL.close()

                    callback(false)
                    return
                }

                var currentSemesterObjectId = student.currentSemester

                dbManip.getObject(currentSemesterObjectId, 'semesters', (currentSemester) => {
                    var courses = currentSemester.courses

                    db.collection('courses').find({_id: {
                        "$in": courses
                    }}).toArray((err, documents) => {
                        dbL.close()
        
                        if(err) {
                            callback(false)
                            return
                        }
                        callback(documents)
                    })
                })
            })
        })
    })
}

exports.listCoursesForFaculty = (faculty, callback) => {
    dbManip.queryId(faculty, 'faculties', (facultyObjectId) => {
        dbConnect((err, dbL) => {
            var db = dbL.db()

            db.collection('courses').find({taughtBy: facultyObjectId}).toArray((err, documents) => {
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