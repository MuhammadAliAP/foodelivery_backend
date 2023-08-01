const { MongoClient, Long } = require("mongodb")

const { mongoConfig } = require("../config")

class MongoDB {
    static connectToMongoDB = () => {
        MongoClient.connect(mongoConfig.connectionUrl).then(
            (connection) => {
                console.log("mongoDB connected");
                this.db = connection.db(mongoConfig.databace)
            }
        ).catch(error => console.log(`mongoDB not connected ${error}`))
    }
}
MongoDB.db = null

module.exports = MongoDB