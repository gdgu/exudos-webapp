// define the credentials to connect to mongodb server
const dbCredentials = {
    hostname: process.env.MONGO_HOST || process.env.MONGO_HOST_XDEV || '127.0.0.1',
    username: process.env.MONGO_USER || process.env.MONGO_USER_XDEV || 'user',
    password: process.env.MONGO_PASSWD || process.env.MONGO_PASSWD_XDEV || '',
    database: process.env.MONGO_DB || process.env.MONGO_DB_XDEV || 'test'
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