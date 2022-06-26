const authorModel = require('../model/AuthorModel');
const blogModel = require('../model/blogModel');

const { default: mongoose } = require('mongoose');




const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) {
        return false
    }
    if (typeof value === 'string' && value.trim().length == 0) {
        return false
    }
    return true
}
// function to check the value given by user should be valid "should not be undefined and null and string should not have free spaces"


// function for title validation
const isValidTitle = function (title) {
    return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1
}

const isValidRequestBody = function (request) {
    return Object.keys(request).length > 0
}
// request should be a valid object like if a object is empty then it will not accept

const nameregex = /^([a-zA-Z]+)$/
//regex for validate the name because name should be alphabetical only
const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
// regex for email validation
const passwordregex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z!#$%&? "])[a-zA-Z0-9!#$%&?]{8,20}$/
//  One digit, one upper case , one lower case ,one special character, its b/w 8 to 20


const validatecreate = async function (req, res, next) {
    try {
        let data = req.body
        let { fname, lname, title, email, password } = data  //object destructinng
        // ---------------------------------------------* validations starts *---------------------------------------------//

        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, msg: "Invalid request parameters. Please provide author details" })
        }
        //here checking the data come from request body should not be empty

        /*---------------------------------------------second method ---------------------------------------------------*/
        // if(!isValid(fname))
        // return res.status(400).send({status:false, msg : "First name is required"})

        // if(!isValid(lname))
        // return res.status(400).send({status:false, msg : "Last name is required"})
        /*---------------------------------------------------------------------------------------------------------------*/


        if (!nameregex.test(fname)) {
            return res.status(400).send({ status: false, msg: "please enter alphabets only" })
        }
        //    validating the name with regex

        if (!nameregex.test(lname)) {
            return res.status(400).send({ status: false, msg: "please enter alphabets only" })
        }
        //      validating the last name with regex

        if (!isValid(title))
            return res.status(400).send({ status: false, msg: "Title is required" })
        if (!isValidTitle(title)) {
            return res.status(400).send({ status: false, message: "Title should be among Mr, Mrs, Miss" })
        }
        //validating the title with above two function

        if (!isValid(email))
            return res.status(400).send({ status: false, msg: "E-mail is required" })
        // validating the email

        let authorEmail = await authorModel.find({ email: data.email })
        if (authorEmail.length !== 0)
            return res.status(401).send({ status: false, msg: "This e-mail address is already exist , Please enter valid E-mail address" })
        //checking the author email is correct or not 

        if (!(emailRegex.test(email))) {
            return res.status(400).send({ status: false, msg: "E-mail should be a valid e-mail address" })
        }
        // validating the email with regex

        /*-------------------------------------------------------------------------------------------------*/
        // if(!isValid(password))
        // return res.status(400).send({status:false, msg:"password is not exist"})
        /*--------------------------------------------------------------------------------------------------*/

        if (!(passwordregex.test(password))) {
            return res.status(400).send({ status: false, msg: "password should have atleast One digit, one upper case , one lower case ,one special character and its b/w 8 to 20 characters" })
        }
        //validating the email with regex

        next()
    }
    catch (err) {
        return res.status(500).send({ msg: "Error", error: err.message })
    }

}

const validateLogin = async function (req, res, next) {

    let data = req.body
    let { email, password } = data //extract params


    if (!isValidRequestBody(data)) {
        return res.status(400).send({ status: false, msg: "Invalid request parameters.Please provide login details" })
    }
    // data should not be empty

    if (!isValid(email)) {
        return res.status(400).send({ status: false, msg: "E-mail is required" })
    }
    //email should be valid

    if (!(emailRegex.test(email))) {
        return res.status(400).send({ status: false, msg: "E-mail should be a valid e-mail address" })
    }
    //validating email with regex
    /*------------------------------------------------------------------------------------------------------*/
    // if(!isValid(password))
    // return res.status(400).send({status:false, msg:"password must be present"})
    /* ------------------------------------------------------------------------------------------------------*/
    if (!(passwordregex.test(password))) {
        return res.status(400).send({ status: false, msg: "password is One digit, one upper case , one lower case ,one special character, its b/w 6 to 20" })
    }
    //validating password with regex
    next()

}

const validateblog = async function (req, res, next) {

    let data = req.body

    let { title, body, authorId, tags, category, subcategory, isPublished } = data //extract param

    if (!isValidRequestBody(data)) {
        return res.status(400).send({ status: false, msg: "Invalid request parameters. Please provide blog details" })
    }
    // data should not be empty

    if (!isValid(title)) {
        return res.status(400).send({ status: false, msg: "Title is required" })
    }
    // title should be among three of them 

    if (!isValid(body)) {
        return res.status(400).send({ status: false, msg: "Body is required" })
    }
    // body should not be empty or not be null and undefined 

    // author id should be valid 
    if (!isValid(title)) {
        return res.status(400).send({ status: false, msg: "Title is required" })
    }
    // title should be  valid

    if (!isValid(category)) {
        return res.status(400).send({ status: false, msg: "Category is required" })
    }
    // category should be valid 

    if (!isValid(subcategory)) {
        return res.status(400).send({ status: false, msg: "subcategory is required" })
    }
    //Subcategory should be valid
    let author = await authorModel.findById(authorId)
    // console.log(author)
    if (!author) {
        return res.status(400).send({ status: false, msg: "Author does not exist" })
    }
    // author id should be valid or should be same in any one of database stored
    next()

}
const validateByQuery = async function (req, res, next) {
    try {
        let data = req.query

        let { authorId, category, subcategory, tags } = data // destructuring 

        let filter = { isDeleted: false, isPublished: true }

        if (!isValidRequestBody(data)) {
            res.status(400).send({ status: false, msg: "please query any one" })          //------its wrong without filter show isdeleted false
            return;
        }
        // validating the body with upper defined function

        if (isValid(authorId)) {
            let author = await blogModel.find({ authorId: authorId });
            if (author.length == 0) {
                res.status(400).send({ status: false, msg: "no data found with this author id " })
                return;
            }
            filter["authorId"] = authorId
        }
        // if author id is correct then add it in filter

        if (isValid(category)) {
            let cat = await blogModel.find({ category: category });
            if (cat.length == 0) {
                res.status(400).send({ status: false, msg: "category is not matching with any blog category" })
                return;
            }

            filter["category"] = category
        }
        // if category is correct then add it in filter

        if (isValid(subcategory)) {
            let subcat = await blogModel.find({ subcategory: subcategory });
            if (subcat.length == 0) {
                res.status(400).send({ status: false, msg: "subcategory is not matching with any one of blog subcategory" })
                return;
            }
            filter["subcategory"] = subcategory
        }
        // if subcategory is correct  then add it in filter

        if (isValid(tags)) {
            let tag = await blogModel.find({ tags: tags });
            if (tag.length == 0) {
                res.status(400).send({ status: false, msg: "tag is not matching with anyone of blog tag" })
                return;
            }
            filter["tags"] = tags
        }


        next()
    }
    catch (err) {
        return res.status(500).send({ msg: "Error", error: err.message })
    }
}


module.exports.validatecreate = validatecreate
module.exports.validateLogin = validateLogin
module.exports.validateblog = validateblog
module.exports.validateByQuery = validateByQuery