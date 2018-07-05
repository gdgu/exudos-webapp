var dbConnect = require('../db/dbconnect')
var dbManip = require('../db/dbmanip')

var random = require('./random/random')

var ObjectId = require('mongodb').ObjectId

exports.getIdName = (objectId, callback) => {
    dbManip.getObject(objectId, 'idNames', (idNameObject) => {
        if(idNameObject == null) {
            // do new insertion
            dbConnect((err, dbL) => {
                var db = dbL.db()

                var name = random.getName()
                var idNameObject = {
                    _id: objectId,
                    name: name
                }

                db.collection('idNames').insertOne(idNameObject, (err, res) => {
                    dbL.close()

                    if(err) return 
                    callback(name)
                })
            })
        }
        else {
            // provide the idName
            callback(idNameObject.name)
        }
    })
}

exports.getObjectId = (name, callback) => {
    dbManip.queryId({name: name}, 'idNames', callback)
}