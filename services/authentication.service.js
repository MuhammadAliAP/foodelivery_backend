const MongoDB = require("./mongodb.services")
const { mongoConfig, tokenSecret } = require("../config")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const config = require("../config")

const userRegister = async (user) => {
    try {
        if (!user?.username || !user?.email || !user?.password)
            return { status: false, message: "Please fill up all the fields" }
        const passwordHash = await bcrypt.hash(user?.password, 10)
        let userObject = {
            username: user?.username,
            email: user?.email,
            password: passwordHash,
        }
        let savedUser = await MongoDB.db
            .collection(mongoConfig.collection.USERS)
            .insertOne(userObject)
        if (savedUser?.acknowledged && savedUser?.insertedId) {
            let token = jwt.sign({ username: userObject?.username, email: userObject?.email },
                "foodelivry_secret", { expiresIn: "24h" })
            return {
                status: true,
                message: "User registered successfully",
                data: token

            }
        } else {
            return {
                status: false,
                message: "User registered failed",

            }
        }
        console.log(savedUser);
    } catch (error) {
        console.log(error)
        let errorMessage = "User registered failed";
        error.code === 11000 && error?.keyPattern?.username ? (errorMessage = "Username already exist") : null
        error.code === 11000 && error?.keyPattern?.email ? (errorMessage = "Email already exist") : null
        return {
            status: false,
            message: errorMessage,
            error: error?.toString()
        }
    }
}


const userLogin = async (user) => {
    try {
        if (!user?.username || !user?.password)
            return { status: false, message: "Please fill up all the fields" }
        let userObject = await MongoDB.db
            .collection(mongoConfig.collection.USERS)
            .findOne({ username: user?.username })
        if (userObject) {
            let isPasswordVerified = await bcrypt.compare(
                user?.password, userObject?.password
            )
            if (isPasswordVerified) {
                let token = jwt.sign({ username: userObject?.username, email: userObject?.email },
                    tokenSecret,
                    { expiresIn: "24h" }
                )
                return {
                    status: true,
                    message: "User login successful",
                    data: token
                }
            } else {
                return {
                    status: false,
                    message: "Incorrect password",
                }
            }


        } else {
            return {
                status: false,
                message: "No user found",

            }
        }



    } catch (error) {
        console.log(error);
        return {
            status: false,
            message: "User login failed",
            error: error?.toString()
        }
    }
}


const checkUserExist = async (params) => {
    let messages = {
        email: "User already exist",
        username: "This username is taken"
    }
    try {
        let queryType = Object.keys(params)//[0]
        let userObject = await MongoDB.db.collection(mongoConfig.collection.USERS)
            .findOne(params)
        console.log(userObject);
        return !userObject ? { status: true, message: `This ${queryType} is not taken` } : { status: false, message: messages[queryType] }
    } catch (error) {
        console.log(error);
    }
}


const tokenVerification = async (req, res, next) => {
    console.log(`authentication.service | tokenVerification | ${req?.originalUrl}`);
    try {
        if (
            req?.originalUrl.endsWith('/login') ||
            req?.originalUrl.endsWith('/user-exist') ||
            req?.originalUrl.endsWith('/register')
        )
            return next()
        let token = req?.headers['authorization']
        if (token && token.startsWith('Bearer')) {
            token = token.slice(7, token?.length)
            jwt.verify(token, config.tokenSecret,async (error, decoded) => {
                if (error) {
                    res.status(401).json({
                        status: false,
                        message: error?.name ? error?.name : "Invalid Token",
                        error: `Invalid Token | ${error?.message}`
                    })
                } else {
                    req['username'] = decoded?.username
                    next()
                }
            })
        } else {
            res.status(401).json({
                status: false,
                message: error?.name ? error?.name : "Token is missing",
                error: `Token is missing`
            })
        }

    } catch (error) {
        res.status(401).json({
            status: false,
            message: error?.message ? error?.message : "Authentication failed",
            error: `Authentication failed| ${error?.message}`
        })

    }
}


const tokenRefresh = async (req, res) => {

    console.log(`
    authentication.service | TokenRefresh |${req?.originalUrl}
    `);
    try {
        let token = req?.headers['authorization']
        if (token && token.startsWith('Bearer')) {
            token = token.slice(7, token?.length)
            jwt.verify(token, config.tokenSecret,{ignoreExpiration:true},async (error, decoded) => {
                if (error) {
                    res.status(401).json({
                        status: false,
                        message: error?.name ? error?.name : "Invalid Token",
                        error: `Invalid Token | ${error?.message}`
                    })
                } else {
                    if (decoded?.username && decoded?.email) {
                        let newToken = jwt.sign(
                            { username: decoded?.username, email: decoded?.email },
                            tokenSecret,
                            { expiresIn: "24h" }
                        )
                        res.json({
                            status: true,
                            message: "Token refresh successful",
                            data: newToken
                        })
                    } else {
                        res.status(401).json({
                            status: false,
                            message: error?.name ? error?.name : "Token missing",
                            error: `Token missing | ${error?.message}`
                        })
                    }

                }
            })
        }
    } catch (error) {
        res.status(401).json({
            status: false,
            message: error?.name ? error?.name : "Token refresh faild",
            error: `Token refresh faild | ${error?.message}`
        })
    }
}
module.exports = { userRegister, userLogin, checkUserExist, tokenVerification ,tokenRefresh}