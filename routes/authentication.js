var express = require('express');
const { userRegister, userLogin, checkUserExist } = require('../services/authentication.service');
var router = express.Router();


router.post("/register", async (req, res, next) => {
    let body = req.body
    let responce = await userRegister(body)
    console.log(body)
    res.json(responce)
})

router.post("/login", async (req, res, next) => {
    let body = req.body
    let responce = await userLogin(body)
    console.log(body)
    res.json(responce)
});

router.get("/user-exist", async (req, res, next) => {
    let params = req.query
    // console.log(req.query);
    let responce = await checkUserExist(params)
    res.json(responce)
});

module.exports = router;
