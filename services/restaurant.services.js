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



const getOneRestaurantById = async (restaurantId) => {
    try {
        let resturant = await MongoDB.db.
            collection(mongoConfig.collection.RESTAURANTS).aggregate(
                [
                    {
                        '$match': {
                            'id': restaurantId
                        }
                    }, {
                        '$lookup': {
                            'from': 'foods',
                            'localField': 'id',
                            'foreignField': 'restaurantId',
                            'as': 'foods'
                        }
                    }
                ]
            )
        toArray()
        console.log(resturant);
        if (resturant && resturant?.length > 0) {
            return {
                status: true,
                message: "resturant found successfully",
                data: resturant[0]
            }
        } else {
            return {
                status: false,
                message: 'resturant not found'
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



module.exports = { getAllRestuant, getOneRestaurantById }