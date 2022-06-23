const express = require('express');
const router = express.Router();
const AuthorController = require("../controller/AuthorController")
const BlogController = require('../controller/blogController')
const mid = require('../middleware/auth')


router.post('/author', AuthorController.createAuthor)
router.post('/blog', mid.authentication, BlogController.createBlog)
router.get('/blogs',mid.authentication, BlogController.getblog)
router.put('/blogs/:blogId', mid.authentication, mid.authorization, BlogController.updateblog)
router.delete('/blogs/:blogId', mid.authentication, mid.authorization, BlogController.deleteById)
router.delete('/blogs', mid.authentication, mid.authorization, BlogController.deleteBlogByquery)
router.post('/login', AuthorController.loginAuthor)





module.exports = router;