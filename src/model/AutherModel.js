const mongoose =require('mongoose');

const autherSchema = new mongoose.Schema({
    fname:{
        type:String,
        required:true
    },
    lname:{
        type:String,
        required:true
    },
    


   
},{timestamps:true});  

module.exports=mongoose.model("book",autherSchema)