var dbConnect = require('./dbconnect')

exports.queryId = (course, callback) => {
    dbConnect((err, dbL) => {
        var db = dbL.db() 
        
        db.collection('courses').findOne(course, (err, res) => {
            dbL.close()
            if(err) return
            
            callback(res._id)
        })
    })
}