var ObjectId = require('mongodb').ObjectID;
var dbConnect = require('../db/dbconnect');
var User = require('../models/User');

// hashing type is RSA-SHA
const hashType = 'RSA-SHA';

exports.authenticate = (lTokenA, lTokenB, callback) => {

    if(lTokenA.toString().length !== 24) {
        callback(false);
        return;
    }
    
    var sDbTask = (err, dbL) => {
        var db = dbL.db();

        db.collection('users').findOne({
            _id: ObjectId(lTokenA),
            password: lTokenB
        }, (err, res) => {
            dbL.close();

            if(res !== undefined && res !== null) {
                var currentUser = new User(res.username, res.password, res.type, res[res.type]);
                currentUser._id = res._id;
                
                callback(true, currentUser);
            }
            else {
                var currentUser = res;
                callback(false);
            }
        });
    };
    dbConnect(sDbTask);

};

exports.verifyCredentials = (username, hashedPassword, callback) => {

    var sDbTask = (err, dbL) => {
        var db = dbL.db()        
        db.collection('users').findOne({
            username: username,
            password: hashedPassword
        }, (err, res) => {
            dbL.close()

            if(res !== undefined && res !== null) {
                var currentUser = new User(res.username, res.password, res.type, res[res.type])
                currentUser._id = res._id
                
                callback(true, currentUser)
            }
            else {
                var currentUser = res
                callback(false)
            }
        })
    }
    dbConnect(sDbTask)
}