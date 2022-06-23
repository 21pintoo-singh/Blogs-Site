const jwt = require("jsonwebtoken");

const authentication = async function (req, res, next) {
    try {
        let token = (req.headers["x-api-key"])

        if (!token) {
            return res.status(400).send({ status: false, msg: "Token must be present", });
        }

        let decodedToken = jwt.verify(token, "author-blog")

        if (!decodedToken) {
            return res.status(400).send({ status: false, msg: "Token is invalid" });
        }
        // let author = req.body.authorId;
        //  let userLoggedIn = decodedToken.authorId
    //    if( author== userLoggedIn){
      res.headers["x-api-key"]=decodedToken.authorId;
        next()
       }
       
    
    catch (err) {
        res.status(500).send({ msg: "Error", error: err.message })
    }

}

const authorization = async function (req, res, next) {
    try {

        let id = req.query.authorId
        let token = (req.headers["x-api-key"])
        let decodedToken = jwt.verify(token, "author-blog")

        if (!id)
            res.status(401).send({ status: false, msg: "authorId must be present" });


        let userLoggedIn = decodedToken.authorId;
        console.log(userLoggedIn)
        let userToBeModified = id;
        console.log(userToBeModified)
        if (userLoggedIn == userToBeModified) {
            next()
        }
        else {
            res.status(401).send({ status: false, msg: "author logged in is not allowed to modify or access the author data" });
        }
    }

    catch (err) {
        res.status(500).send({ msg: "Error", error: err.message })
    }

}

module.exports.authentication = authentication
module.exports.authorization = authorization