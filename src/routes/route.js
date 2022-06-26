const express = require('express');
const router = express.Router();
const AuthorController = require("../controller/AuthorController")
const BlogController = require('../controller/blogController')
const middlewareAuth = require('../middleware/auth')
const middlewareValidate = require('../middleware/validate')


router.post('/authors',middlewareValidate.validatecreate, AuthorController.createAuthor) // create auther

router.post('/blogs', middlewareAuth.authentication,middlewareValidate.validateblog, BlogController.createBlog) //create blog

router.get('/blogs',middlewareAuth.authentication,middlewareAuth.authorization, middlewareValidate.validateByQuery, BlogController.getblog) //get blog

router.put('/blogs/:blogId',middlewareAuth.authentication,middlewareAuth.authorization,  BlogController.updateblog)  // update blog

router.delete('/blogs/:blogId', middlewareAuth.authentication, middlewareAuth.authorization, BlogController.deleteById) //delete blog by id

router.delete('/blogs', middlewareAuth.authentication, middlewareAuth.authorization,middlewareValidate.validateByQuery, BlogController. deleteBlogByquery) //delete by query

router.post('/login',middlewareValidate.validateLogin, AuthorController.loginAuthor) // login 





module.exports = router;