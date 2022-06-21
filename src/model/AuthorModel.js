const mongoose =require('mongoose');

const { isEmail } =require( 'validator');

const autherSchema = new mongoose.Schema({
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
        validate:[ isEmail, 'invalid email' ]
    },
    password:{
        type:String,
        required:true
    }



   
},{timestamps:true});  

module.exports=mongoose.model("author",autherSchema)