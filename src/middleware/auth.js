const jwt = require("jsonwebtoken");
const blogModel = require("../model/blogModel");
const mongoose =require('mongoose');

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}

//----- authentication process to validate the person ----------------------------------------//
const authentication = async function (req, res, next) {
    try {
        let token = (req.headers["x-api-key"])

        if (!token) {
            return res.status(400).send({ status: false, msg: "Token must be present", });
        }
        let decodedToken = jwt.verify(token, "author-blog")      // decoding token 

        if (!decodedToken) {
            return res.status(400).send({ status: false, msg: "Token is invalid" });
        }
        next()
    }


    catch (err) {
        return res.status(500).send({ msg: "Error", error: err.message })
    }

}

//-------------------------authorization process to authorize the person -------------------------------//
const authorization = async function (req, res, next) {
    try {

        let blogId = req.params.blogId
     
        
        let token = (req.headers["x-api-key"])
        let decodedToken = jwt.verify(token, "author-blog")           // verifying the token 
        let tokenauthorId = decodedToken.authorId;

        if (blogId) {
            let autherId1 = await blogModel.findOne({ _id: blogId, authorId: tokenauthorId })
            //  console.log(autherId1)
            if (autherId1 == null) {
                return res.status(401).send({ status: false, msg: "you are not authorize" });
            }
            // else {
            //     next()
            // }

        }
        next()

    }

    catch (err) {
        return res.status(500).send({ msg: "Error", error: err.message })
    }

}

module.exports.authentication = authentication
module.exports.authorization = authorization