var dbConnect = require('../db/dbconnect')
var dbManip = require('../db/dbmanip')

var ObjectId = require('mongodb').ObjectId

exports.getDocument = (documentObjectIdString, callback) => {
    if(ObjectId.isValid(documentObjectIdString)) {
        var documentObjectId = new ObjectId(documentObjectIdString)

        dbConnect((error, dbL) => {
            var db = dbL.db()

            db.collection('documents').findOne({_id: documentObjectId}, (error, documentObjectRetrieved) => {

                dbL.close()

                if(error || documentObjectRetrieved == null) {
                    callback(false)
                    return
                }

                callback(true, {
                    content: documentObjectRetrieved.content.buffer,
                    mimeType: documentObjectRetrieved.mimeType
                })
            })
        })

    }
    else {
        callback(false)
    }
}