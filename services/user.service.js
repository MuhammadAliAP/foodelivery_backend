const { mongoConfig } = require("../config");
const MongoDB = require("./mongodb.services");

const getUserData = async (username) => {
    try {
        let userObject = await MongoDB.db.
            collection(mongoConfig.collection.USERS)
            .findOne({ username })
            
        if (userObject) {
            return {
                status: true,
                message: "User found successfully",
                data: userObject
            }
        } else {
            return {
                status: false,
                message: 'User not found'
            }
        }

    } catch (error) {
        return {
            status: false,
            message: 'User finding failed',
            error: `User finding failed ${error?.message}`
        }
    }
}

module.exports = { getUserData }