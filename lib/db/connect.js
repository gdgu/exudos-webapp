const dbCredentials = {
    hostname: process.env.MONGO_HOST,
    username: process.env.MONGO_USER,
    password: process.env.MONGO_PASSWD,
    database: process.env.MONGO_DB
}

// import the mongodb module
var mongodb = require('mongodb')

// use the MongoClient class
MongoClient = mongodb.MongoClient

// define the mongodb connection url
const mongoConnectUrl = `mongodb://${dbCredentials.username}:${dbCredentials.password}@${dbCredentials.hostname}/${dbCredentials.database}`

// perform all database tasks inside the main method
function main(err, db) {
    
    if(err) throw err

    console.log("Database connection succcessful...")

    var openedDb = db.db(dbCredentials.database)
    
    openedDb.collection("schools").find().toArray((err, res) => {
        if(err) throw err

        console.log(res)

        // close the database connection
        db.close()
    })
    
}

// create a mongo client to perform main
var client = MongoClient.connect(mongoConnectUrl, main)
