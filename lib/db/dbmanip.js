var dbConnect = require('./dbconnect')

exports.queryId = (object, collectionName, callback) => {
    dbConnect((err, dbL) => {
        var db = dbL.db() 
        
        db.collection(collectionName).findOne(object, (err, res) => {
            dbL.close()
            if(err) return
            
            callback(((res != null) ? res._id : null))
        })
    })
}

exports.getObject = (objectId, collectionName, callback) => {
    dbConnect((err, dbL) => {
        var db = dbL.db()

        db.collection(collectionName).findOne({_id: objectId}, (err, res) => {
            dbL.close()
            if(err) return

            callback(res)
        })
    })
}