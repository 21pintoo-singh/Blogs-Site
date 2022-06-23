const authorModel = require('../model/AuthorModel');
const jwt = require("jsonwebtoken");

// function for checking type of values given by user(user inputs)
const isValid = function(value)
{
    if(typeof value === 'undefined' || value === null){
        return false
    }
    if(typeof value === 'string' && value.trim().length == 0){
        return false
    }
    return true             

} 
// function for title validation
const isValidTitle = function(title){
    return ["Mr", "Mrs","Miss"].indexOf(title)!== -1
}

// Or we can use  this for title validation

// const isValidTitle = function(title){
//     return ["Mr", "Mrs","Miss"].includes(title)
// }

const emailRegex =  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

const isValidRequestBody = function(request){  
    return Object.keys(request).length>0
}

const createAuthor = async function(req,res){
    try{

    let data = req.body
    let {fname, lname, title, email, password}= data  //object destructinng
// ---------------------------------------------* validations starts *---------------------------------------------//
    
    if(!isValidRequestBody(data)){
        return res.status(400).send({status:false, msg : "Invalid request parameters. Please provide author details"})
    }

    if(!isValid(fname))
    return res.status(400).send({status:false, msg : "First name is required"})

    if(!isValid(lname))
    return res.status(400).send({status:false, msg : "Last name is required"})

    if(!isValid(title))

    return res.status(400).send({status:false, msg:"Title is required"})

    if (!isValidTitle(title)) {
        return res.status(400).send({ status: false, message: "Title should be among Mr, Mrs, Miss" })
    }

    if(!isValid(email))
    return res.status(400).send({status:false, msg:"E-mail is required"})

    let authorEmail= await authorModel.find({email:data.email})
    if(authorEmail.length!==0)
    return res.status(401).send({status:false, msg:"This e-mail address is already exist , Please enter valid E-mail address"})

    if(!(emailRegex.test(email))){
        return res.status(400).send({status:false, msg:"E-mail should be a valid e-mail address"})
    }

    if(!isValid(password))
    return res.status(400).send({status:false, msg:"password is not exist"})


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


    if(!isValidUserInput(data)){
        return res.status(400).send({status:false, msg : "Invalid request parameters.Please provide login details"})
    }

    if(!isValid(email)){
    return res.status(400).send({status:false, msg:"E-mail is required"})
    }

    if(!(emailRegex.test(email))){
        return res.status(400).send({status:false, msg:"E-mail should be a valid e-mail address"})
    }

    if(!isValid(password))
    return res.status(400).send({status:false, msg:"password must be present"})
  
    let author = await authorModel.findOne({ email: email, password: password });

    if (!author)
      return res.status(401).send({status: false,msg: "Invalid login credenctial",});

let token = jwt.sign(
    {
      authorId: author._id.toString(),
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000)+10*60*60
    },
    'author-blog'
  );
  res.setHeader("x-api-key", token);
  return res.status(200).send({ status: true, data: token, msg: "Author successfully logged in" });
}
catch (err){
    return res.status(500).send({ msg: "Error", error: err.message })
}
};


module.exports.createAuthor = createAuthor
module.exports.loginAuthor = loginAuthor