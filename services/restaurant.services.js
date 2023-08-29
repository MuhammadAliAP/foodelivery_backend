const MongoDB = require("./mongodb.services")
const { mongoConfig } = require("../config")

const getAllRestuant = async () => {
    try {
        let resturants = await MongoDB.db.
            collection(mongoConfig.collection.RESTAURANTS)
            .find().toArray()
        console.log(resturants);

        if (resturants && resturants?.length > 0) {
            return {
                status: true,
                message: "resturants found successfully",
                data: resturants
            }
        } else {
            return {
                status: false,
                message: 'resturants not found'
            }
        }
    } catch (error) {
        return {
            status: false,
            message: 'resturants finding failed',
            error: `resturants finding failed : ${error?.message}`
        }
    }
}

module.exports = { getAllRestuant }