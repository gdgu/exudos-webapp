var dbConnect = require('./dbconnect')

exports.queryId = (object, collectionName, callback) => {
    dbConnect((err, dbL) => {
        var db = dbL.db() 
        
        db.collection(collectionName).findOne(object, (err, res) => {
            dbL.close()
            if(err) return
            
            callback(res._id)
        })
    })
}

exports.getObject = (objectId, collectionName, callback) => {
    dbConnect((err, dbL) => {
        var db = dbL.db()

        db.collection(collectionName).findOne(objectId, (err, res) => {
            dbL.close()
            if(err) return

            callback(res)
        })
    })
}