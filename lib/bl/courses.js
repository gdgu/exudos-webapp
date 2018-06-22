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

            db.collection('courseMaterials').find({_id: courseObjectId}).toArray((err, documents) => {
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

            
        })
    })
}