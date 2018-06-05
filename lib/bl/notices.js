var dbConnect = require('../db/dbconnect')
var schoolsManip = require('../db/schoolsmanip')
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
    schoolsManip.queryId(school, (schoolObjectId) => {
        dbConnect((err, dbL) => {
            var db  = dbL.db()

            db.collection('notices').find({school: schoolObjectId}, (err, res) => {

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

exports.listNoticesByProgramme = (programme, callback) => {
    programmesManip.queryId = (programme, (programmeObjectId) => {
        dbConnect((err, dbL) => {
            var db = dbL.db()

            db.collection('notices').find({programme: programmeObjectId}, (err, res) => {

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