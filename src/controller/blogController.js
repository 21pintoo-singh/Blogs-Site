const { default: mongoose } = require('mongoose');
const jwt = require("jsonwebtoken");

const authorModel = require('../model/AuthorModel');
const blogModel = require('../model/blogModel');

// ----------------------API to create blog----------------------------------------//
const createBlog = async function (req, res) {

    try {
        let data = req.body;
        data.tags = [...new Set(data.tags)]   //remove the dublicate tags
        data.subcategory = [...new Set(data.subcategory)]  //remove the dublicate subcategory

        const newBlog = await blogModel.create(data)
        return res.status(201).send({ status: true, msg: "New blog created successfully", data: newBlog })

    }

    catch (err) {
        res.status(500).send({ msg: "Error", error: err.message })
    }
}

//------------------API to get the blog according to the user filter--------------------------//
const getblog = async function (req, res) {

    try {
        let data = req.query
        let filter = { isDeleted: false, isPublished: true, ...data }

        let blogs = await blogModel.find(filter)

        if (blogs && blogs.length === 0) {
            return res.status(404).send({ status: false, msg: "no such document exist" })
        }
        else {
            return res.status(200).send({ status: true, msg: "Blog details accessed successfully", data: blogs, })
        }
    }
    catch (err) {
        return res.status(500).send({ msg: "Error", error: err.message })
    }
}

//--------------------API to update the blog whom user want to update-------------------------------------//
const updateblog = async function (req, res) {

    try {
        let blogId = req.params.blogId;
        let data = req.body;


        if (Object.keys(data).length == 0)
            return res.status(400).send({ status: false, msg: "Body is required" });
        // data should not be empty

        let blogData = await blogModel.findOne({ _id: blogId, isDeleted: false });

        if (!blogData) return res.status(404).send({ status: false, msg: "blogs-Id related data unavailable" })

        if (data.title) blogData.title = data.title;
        if (data.body) blogData.body = data.body;
        if (data.category) blogData.category = data.category;        // updating the title body and category
        if (data.tags) {
            if (typeof data.tags == "object") {
                blogData.tags.push(...data.tags);
            }
        } // adding the tags

        if (data.subcategory) {
            if (typeof data.subcategory == "object") {
                blogData.subcategory.push(...data.subcategory);
            }
        }// adding the subcategory

        blogData.publishedAt = Date();          // updating the date
        blogData.isPublished = true;
        blogData.save();                        // saving every updation

        let datasave = await blogModel.findOneAndUpdate({ _id: blogId }, { blogData })
        return res.status(200).send({ status: true, data: datasave });

    } catch (error) {
        return res.status(500).send({ status: false, msg: error.message });
    }
};


//--------------------------API to delete the blog with its blog id-----------------------------------//

const deleteById = async function (req, res) {

    try {
        let blogId = req.params.blogId
        if (!blogId) {
            res.status(400).send({ status: false, msg: "please enter blogid in param" })
            return;
        }
        let blog = await blogModel.findOne({ $and: [{ _id: blogId }, { isDeleted: false }] })

        if (!blog) {
            return res.status(404).send({ status: false, msg: "No such blog exist or the blog is deleted" })
        }

        let afterDeletion = await blogModel.findOneAndUpdate({ _id: blogId }, { $set: { isDeleted: true } }, { new: true })

        return res.status(200).send({ status: true, msg: "Blog deleted succesfully", data: afterDeletion })
    }
    catch (err) {
        return res.status(500).send({ msg: "Error", error: err.message })
    }
}

//-------------------------------API to delete the blog according to user query -----------------------------------//
let deleteBlogByquery = async function (req, res) {
    try {
        let data = req.query


        let token = (req.headers["x-api-key"])
        let decodedToken = jwt.verify(token, "author-blog")           // verifying the token 
        let tokenauthorId = decodedToken.authorId;
        let filter = { isDeleted: false, isPublished: true, authorId: tokenauthorId, ...data }

        let blog = await blogModel.find(filter)

        if (blog && blog.length == 0) {
            return res.status(404).send({ status: false, msg: "No such document exist or it may be deleted" })
        }
        // if blog is not  found then send status false

        let deletedBlog = await blogModel.updateMany({ _id: { $in: blog } }, { $set: { isDeleted: true, deletedAt: Date.now } }, { new: true })
        return res.status(200).send({ status: true, msg: "Blog deleted successfully", data: deletedBlog })

    }  // if blog found then mark isdeleted value to true and set the date of deleted at
    catch (err) {
        return res.status(500).send({ msg: "Error", error: err.message })
    }
}



module.exports.getblog = getblog
module.exports.createBlog = createBlog
module.exports.updateblog = updateblog
module.exports.deleteById = deleteById
module.exports.deleteBlogByquery = deleteBlogByquery