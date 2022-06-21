const express = require('express');
const router = express.Router();
const authorController=require("../controller/authorController")
const blogController=require("../controller/blogController")

router.post("/authors",authorController.createAuthor)
router.post("/blog",blogController.createBlog)
router.get("/notDeleted",blogController.notDeleted)
router.get("/listing",blogController.listing)
module.exports = router;