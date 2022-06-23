const mongoose =require('mongoose');

const { isEmail } =require( 'validator');

const authorSchema = new mongoose.Schema({
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    title:{
        type:String,
        enum:["Mr","Mrs","Miss"],
        required:true
    },
    email:{
        type:String,
        required:true,
        unique : true,
        lowercase:true,
        trim:true,
        validate:[ isEmail, 'invalid email' ]
    },
    password:{
        type:String,
        required:true,
        trim:true
    }



   
},{timestamps:true});  

module.exports=mongoose.model("author",authorSchema)