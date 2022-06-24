const authorModel = require('../model/AuthorModel');
const jwt = require("jsonwebtoken");

// function for checking type of values given by user(user inputs)
const isValid = function(value)
{
    if(typeof value === 'undefined' || value === null){
        return false
    }
    //value given by user should not be undefined and null
    if(typeof value === 'string' && value.trim().length == 0){
        return false
    }
    //value given by user should  be string and not with only space 
    return true             

} 
// function for title validation
const isValidTitle = function(title){
    return ["Mr", "Mrs","Miss"].indexOf(title)!== -1
}


//-----------------------------------------------------second method--------------------------------------------------------//
// Or we can use  this for title validation

// const isValidTitle = function(title){
//     return ["Mr", "Mrs","Miss"].includes(title)
// }
//---------------------------------------------------------------------------------------------------------------------------//


const nameregex= /^([a-zA-Z]+)$/
//regex for validate the name because name should be alphabetical only
const emailRegex =  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
// regex for email validation
const passwordregex = /^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&? "])[a-zA-Z0-9!#$%&?]{8,20}$/
//  One digit, one upper case , one lower case ,one special character, its b/w 6 to 20

const isValidRequestBody = function(request){  
    return Object.keys(request).length>0
}
// request should be a valid object like if a object is empty then it will not accept

const createAuthor = async function(req,res){
    
    try{
    let data = req.body
    let {fname, lname, title, email, password}= data  //object destructinng
// ---------------------------------------------* validations starts *---------------------------------------------//
    
    if(!isValidRequestBody(data)){
        return res.status(400).send({status:false, msg : "Invalid request parameters. Please provide author details"})
    }
    //here checking the data come from request body should not be empty

    /*---------------------------------------------second method ---------------------------------------------------*/
    // if(!isValid(fname))
    // return res.status(400).send({status:false, msg : "First name is required"})
    
    // if(!isValid(lname))
    // return res.status(400).send({status:false, msg : "Last name is required"})
    /*---------------------------------------------------------------------------------------------------------------*/


       if(!nameregex.test(fname)){
        return res.status(400).send({status:false,msg:"please enter alphabets only"})
       }
       //    validating the name with regex

       if(!nameregex.test(lname)){
        return res.status(400).send({status:false,msg:"please enter alphabets only"})
       }
       //      validating the last name with regex

    if(!isValid(title))
     return res.status(400).send({status:false, msg:"Title is required"})
     if (!isValidTitle(title)) {
        return res.status(400).send({ status: false, message: "Title should be among Mr, Mrs, Miss" })
    }
    //validating the title with above two function

    if(!isValid(email))
    return res.status(400).send({status:false, msg:"E-mail is required"})
    // validating the email

    let authorEmail= await authorModel.find({email:data.email})
    if(authorEmail.length!==0)
    return res.status(401).send({status:false, msg:"This e-mail address is already exist , Please enter valid E-mail address"})
    //checking the author email is correct or not 

    if(!(emailRegex.test(email))){
        return res.status(400).send({status:false, msg:"E-mail should be a valid e-mail address"})
    }
    // validating the email with regex
    
    /*-------------------------------------------------------------------------------------------------*/
    // if(!isValid(password))
    // return res.status(400).send({status:false, msg:"password is not exist"})
    /*--------------------------------------------------------------------------------------------------*/

    if(!(passwordregex.test(password))){
        return res.status(400).send({status:false,msg:"password is One digit, one upper case , one lower case ,one special character, its b/w 6 to 20"})
    }
    //validating the email with regex

    let authorCreated = await authorModel.create(data)
    return res.status(201).send({status:true,msg: "Author created successfully", data : authorCreated})
}
catch(err){
    return res.status(500).send({msg:"Error", error:err.message})
}
    
}

const loginAuthor = async function (req, res) {
    try{
    
    let data =req.body
    let {email,password}=data //extract params


    if(!isValidRequestBody(data)){
        return res.status(400).send({status:false, msg : "Invalid request parameters.Please provide login details"})
    }
    // data should not be empty

    if(!isValid(email)){
    return res.status(400).send({status:false, msg:"E-mail is required"})
    }
    //email should be valid

    if(!(emailRegex.test(email))){
        return res.status(400).send({status:false, msg:"E-mail should be a valid e-mail address"})
    }
    //validating email with regex
    /*------------------------------------------------------------------------------------------------------*/
    // if(!isValid(password))
    // return res.status(400).send({status:false, msg:"password must be present"})
    /* ------------------------------------------------------------------------------------------------------*/
    if(!(passwordregex.test(password))){
        return res.status(400).send({status:false,msg:"password is One digit, one upper case , one lower case ,one special character, its b/w 6 to 20"})
    }
    //validating password with regex

    let author = await authorModel.findOne({ email: email, password: password });

    if (!author)
      return res.status(401).send({status: false,msg: "Invalid login credential",});

let token = jwt.sign(                    //making the token
    {
      authorId: author._id.toString(),
      project:"blogging-Site"
    },
    'author-blog'
  );
  res.setHeader("x-api-key", token);
  return res.status(200).send({ status: true,  msg: "Author successfully logged in",data:token });
}
catch (err){
    return res.status(500).send({ msg: "Error", error: err.message })
}
};


module.exports.createAuthor = createAuthor
module.exports.loginAuthor = loginAuthor





// /^([a-zA-Z]+)$/
