var dbConnect = require('../db/dbconnect')
var dbManip = require('../db/dbmanip')
var Notice = require('../models/Notice')

exports.createNotice = (notice, callback) => {
    dbConnect((err, dbL) => {
        var db = dbL.db()

        db.collection('notices').insertOne(notice, (err) => {

            dbL.close()

            if(err) {
                callback(false)
                return
            }
            callback(true)
        })
    })
}

exports.listNoticesBySchool = (school, callback) => {
    dbManip.queryId(school, 'schools', (schoolObjectId) => {
        dbConnect((err, dbL) => {
            var db  = dbL.db()

            db.collection('notices').find({school: schoolObjectId}).toArray((err, documents) => {

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

exports.listNoticesByCourse = (course, callback) => {
    dbManip.queryId(course, 'courses', (courseObjectId) => {
        dbConnect((err, dbL) => {
            var db = dbL.db()

            db.collection('notices').find({courses: courseObjectId}).toArray((err, documents) => {

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