const jwt = require("jsonwebtoken");

const authentication = async function(req,res,next){
    try{
        let token  = (req.headers["x-api-key"])

        if (!token){
        return res.status(400).send({status: false, msg: "Token must be present",});
        }

        let decodedToken = jwt.verify(token, "author-blog")

        if(!decodedToken){
        return res.status(400).send({status: false, msg: "Token is invalid"});
        }
        let userLoggedIn = decodedToken.authorId
        req["authorId"] = userLoggedIn

        next()

    }
    catch (err){
        res.status(500).send({ msg: "Error", error: err.message })
    }

}

const authorization = async function(req,res,next){
    try{
        let authId =req.param.authorId
        let id =req.authorId
        // let token  = (req.headers["x-api-key"])
        // let decodedToken = jwt.verify(token, "author-blog")

        if(!id)
        res.status(401).send({status: false, msg: "authorId must be present"});

        if(id !=authId){
            next()
        }else{
            res.status(401).send({status: false, msg: "author logged in is not allowed to modify or access the author data"});
        }
    }

catch (err){
    res.status(500).send({ msg: "Error", error: err.message })
}

}

module.exports.authentication = authentication
module.exports.authorization = authorization