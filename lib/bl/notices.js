var dbConnect = require('../db/dbconnect')
var querySchoolId = require('../db/queryschool')
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

exports.listNotices = (school, callback) => {
    querySchoolId.query(school, (schoolObjectId) => {
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