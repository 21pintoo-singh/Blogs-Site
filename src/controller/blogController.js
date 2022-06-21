const AuthorModel = require("../model/AuthorModel");
const blogModel = require("../model/blogModel");
const router = require("../routes/route");

const createBlog = async function (req, res) {
    try {
        let data = req.body;
        let Id = data.authorId;
        if (!Id) {
            res.status(400).send("please enter author id")
            return;
        }
        let authorId = await AuthorModel.findById(Id);
        if (!authorId) {
            res.status(400).send("please enter valid userId")
        }
        let result = await blogModel.create(data)
        res.status(201).send({
            status: true,
            data: result
        })
    } catch (err) {
        res.status(500).send({
            status: false,
            msg: err.message
        })
    }
}

const notDeleted = async function(req,res){
    let present = await blogModel.find({isPublished:true,isDeleted:"false",})
    res.status(200).send(present)
}

const listing = async function(req,res){
    
        try{
                let qwery = req.query
                let filter = {
                    isDeleted: false,     
                    isPublished: true,
                    ...qwery
                }
                 console.log(filter)
    
                const filterByQuery = await blogModel.find(filter)  //finding the blog by the condition that is stored in the fiter variable.
                if(filterByQuery.length == 0) {
                    return res.status(404).send({status:false, msg:"No blog found"})
                }
                console.log("Data fetched successfully")
                res.status(201).send({status:true, data:filterByQuery})
        }
        catch(err) {
        console.log(err)
        res.status(500).send({status:false, msg: err.message})
        }
    }  
    


module.exports.createBlog = createBlog;
module.exports.notDeleted= notDeleted;
module.exports.listing=listing;