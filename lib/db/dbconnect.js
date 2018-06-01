// define the credentials to connect to mongodb server
const dbCredentials = {
    hostname: process.env.MONGO_HOST || '127.0.0.1',
    username: process.env.MONGO_USER || 'user',
    password: process.env.MONGO_PASSWD || '',
    database: process.env.MONGO_DB || 'test'
};

// import the mongodb module
var mongodb = require('mongodb');

// use the MongoClient class
MongoClient = mongodb.MongoClient;

// define the mongodb connection url
const mongoConnectUrl = `mongodb://${dbCredentials.username}:${dbCredentials.password}@${dbCredentials.hostname}/${dbCredentials.database}`;

module.exports = (dbTask) => {
    if(typeof dbTask !== 'function') throw new TypeError(`first argument dbTask must be a function(err, db), ${typeof dbTask} found`);
    // create a mongo client to perform a database task
    var client = MongoClient.connect(mongoConnectUrl, dbTask);
};