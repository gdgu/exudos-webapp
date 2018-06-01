var dbConnect = require('./dbconnect')

exports.query = (school, callback) => {
    dbConnect((err, dbL) => {
        var db = dbL.db()

        db.collection('schools').findOne(school, (err, res) => {
            dbL.close()
            if(err) return

            callback(res._id)
        })
    })
}