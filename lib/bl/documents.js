var dbConnect = require('../db/dbconnect')
var dbManip = require('../db/dbmanip')

var ObjectId = require('mongodb').ObjectId
var Binary = require('mongodb').Binary

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

exports.addDocument = (documentObject, callback) => {
    documentObject.content = new Binary(documentObject.content)

    dbConnect((error, dbL) => {
        var db = dbL.db()

        db.collection('documents').insertOne(documentObject, (error, res) => {

            dbL.close()

            if(error) {
                callback(false)
                return
            }

            callback(true, res.insertedId)
        })
    })
}