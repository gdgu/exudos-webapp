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
            if(res !== undefined && res !== null) {
                var currentUser = res;                
                callback(true, currentUser);
            }
            else {
                var currentUser = res;
                callback(false);
            }
            dbL.close();
        });
    };
    dbConnect(sDbTask);

};