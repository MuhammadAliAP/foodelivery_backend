const config = require("./package.json").projectConfig

module.exports = {
    mongoConfig: {
        connectionUrl:config.mongoConnectionUrl,
        databace: "foodelivery_db",
        collection: {
            USERS: "users",
            RESTAURANTS:"restaurants"
        }
    },
    serverConfig:{
        ip:config.serverIp,
        port:config.serverPort
    },
    tokenSecret:"foodelivry_secret"
}