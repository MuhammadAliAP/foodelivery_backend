var express = require('express');
const { getAllRestuant } = require('../services/restaurant.services');
var router = express.Router();


router.get("/", async (req, res) => {
    let response = await getAllRestuant();
    res.json(response);
});

module.exports = router