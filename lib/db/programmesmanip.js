var dbConnect = require('./dbconnect')

exports.queryId = (programme, callback) => {
    dbConnect((err, dbL) => {
        var db = dbL.db() 
        
        db.collection('programmes').findOne(programme, (err, res) => {
            dbL.close()
            if(err) return
            
            callback(res._id)
        })
    })
}