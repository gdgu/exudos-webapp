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
    dbManip.queryId = (programme, 'programmes', (programmeObjectId) => {
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