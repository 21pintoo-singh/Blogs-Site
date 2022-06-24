const { default: mongoose } = require('mongoose');

const authorModel = require('../model/AuthorModel');
const blogModel = require('../model/blogModel');

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}
// function to check the valid object id


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

const isValidRequestBody = function (data) {
    return Object.keys(data).length > 0
}
// function to check the object is empty or not 


// ----------------------API to create blog----------------------------------------//
const createBlog = async function (req, res) {
    
    try {
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

        if (!isValid(authorId)) {
            return res.status(400).send({ status: false, msg: "Author Id is required" })
        }
        // author id should be valid 


        if (!isValid(category)) {
            return res.status(400).send({ status: false, msg: "Category is required" })
        }
        // category should be valid 

        let author = await authorModel.findById(authorId)
        if (!author) {
            return res.status(400).send({ status: false, msg: "Author does not exist" })
        }
        // author id should be valid or should be same in any one of database stored

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
        let { authorId, category, subcategory, tags } = data // destructuring 

        let filter = { isDeleted: false, isPublished: true }
        if (!isValidRequestBody(data)) {
            res.status(400).send({ status: false, msg: "please query any one" })
            return;
        }
        // validating the body with upper defined function

        if (isValid(authorId) && isValidRequestBody(authorId)) {
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
        // if tags is correct then add it in filter


        let blogs = await blogModel.find(filter)

        if (blogs && blogs.length === 0)
            res.status(404).send({ status: false, msg: "no such document exist or it maybe deleted" })
        // blog should be present 
        res.status(200).send({ status: true, msg: "Blog details accessed successfully", data: blogs, })
    }
    catch (err) {
        res.status(500).send({ msg: "Error", error: err.message })
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

        res.status(200).send({ status: true, data: blogData });
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
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

        if (!blog)
            res.status(404).send({ status: false, msg: "No such blog exist or the blog is deleted" })

        if (blog.isDeleted == true)
            return res.status(404).send({ status: false, msg: "No such blog exist or the blog is deleted" })

        let afterDeletion = await blogModel.findOneAndUpdate({ _id: blogId }, { $set: { isDeleted: true } }, { new: true })

        return res.status(200).send({ status: true, data: afterDeletion, msg: "Blog deleted succesfully" })
    }
    catch (err) {
        res.status(500).send({ msg: "Error", error: err.message })
    }
}

//-------------------------------API to delete the blog according to user query -----------------------------------//
let deleteBlogByquery = async function (req, res) {

    try {
        let data = req.query
        if (!isValidRequestBody(data)) {
            res.status(400).send({ status: false, msg: "please query any one" })
            return;
        }
        let { authorId, category, subcategory, tags } = data  //extracting

        let filter = { isDeleted: false, isPublished: true }

        if (!isValidRequestBody(data)) {
            return res.status(400).send({ status: false, msg: "No query param received. Please query details" })
        }
        // validating the data 

        if (!isValidObjectId(authorId)) {
            return res.status(400).send({ sttaus: false, msg: ` please enter a authorid or valid author id ` });
        }

        if (isValid(authorId) && isValidRequestBody(authorId)) {
            let author = await blogModel.find({ authorId: authorId });
            if (author.length == 0) {
                res.status(400).send({ status: false, msg: "no data found with this author id " })
                return;
            }
            filter["authorId"] = authorId
        }// if author id is matched with database then add it into filter

        if (isValid(category)) {
            let cat = await blogModel.find({ category: category });
            if (cat.length == 0) {
                res.status(400).send({ status: false, msg: "category is not matching with any blog category" })
                return;
            }
            filter["category"] = category
        }// if category is matched then add it into filter

        if (isValid(subcategory)) {
            let subcat = await blogModel.find({ subcategory: subcategory });
            if (subcat.length == 0) {
                res.status(400).send({ status: false, msg: "subcategory is not matching with any one of blog subcategory" })
                return;
            }
            filter["subcategory"] = subcategory
        } // if subcategory is matched then add it into filter

        if (isValid(tags)) {
            let tag = await blogModel.find({ tags: tags });
            if (tag.length == 0) {
                res.status(400).send({ status: false, msg: "tag is not matching with anyone of blog tag" })
                return;
            }
            filter["tags"] = tags
        }// if tag is matched then add it into filter



        let blog = await blogModel.find(filter)

        if (blog && blog.length == 0) {
            return res.status(404).send({ status: false, msg: "No such document exist or it may be deleted" })
        }
        // if blog is not  found then send status false


        let deletedBlog = await blogModel.updateMany({ _id: { $in: blog } }, { $set: { isDeleted: true, deletedAt: Date.now } }, { new: true })
        return res.status(200).send({ status: true, msg: "Blog deleted successfully", data: deletedBlog })

    }  // if blog found then mark isdeleted value to true and set the date of deleted at
    catch (err) {
        res.status(500).send({ msg: "Error", error: err.message })
    }
}



module.exports.getblog = getblog
module.exports.createBlog = createBlog
module.exports.updateblog = updateblog
module.exports.deleteById = deleteById
module.exports.deleteBlogByquery = deleteBlogByquery