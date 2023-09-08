var express = require('express');
const { getAllRestuant, getOneRestaurantById } = require('../services/restaurant.services');
var router = express.Router();


router.get("/", async (req, res) => {
    let response = await getAllRestuant();
    res.json(response);
});


router.get("/:restaurantId", async (req, res) => {
    let restaurantId = req?.params?.restaurantId
    let response = await getOneRestaurantById(restaurantId);
    res.json(response);
});

module.exports = router