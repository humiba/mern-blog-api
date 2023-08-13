const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });

const {
  createNewPost,
  getAllPosts,
  getSpecificPost,
  updatePost,
} = require("../controllers/postController");

// TODO: Create new post
router.post("/api/post", uploadMiddleware.single("file"), createNewPost);

// TODO: Get all posts
router.get("/api/post", getAllPosts);

// TODO: Get specific post by ID
router.get("/api/post/:id", getSpecificPost);

// TODO: Update post
router.put("/api/post", uploadMiddleware.single("file"), updatePost);

module.exports = router;
