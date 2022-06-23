const express = require('express');
const router = express.Router();
const AuthorController = require("../controller/AuthorController")
const BlogController = require('../controller/blogController')
const mid= require('../middleware/auth')


router.post('/author', AuthorController.createAuthor)
router.post('/blog', BlogController.createBlog)
router.get('/blogs',  BlogController.getblog)
router.put('/blogs/:blogId', BlogController.updateblog)
router.delete('/blogs/:blogId', BlogController.deleteById)
router.delete('/blogs', BlogController.deleteBlogByquery)
router.post('/login', AuthorController.loginAuthor)





module.exports = router;