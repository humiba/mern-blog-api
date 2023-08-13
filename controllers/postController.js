const fs = require("fs");
const jwt = require("jsonwebtoken");

const { postModel } = require("../models/postModel");
const secret = "asdfe45we45w345wegw345werjktjwertkj";

// TODO: Create new post
const createNewPost = async (req, res) => {
  const { originalname, path } = req.file;

  // split file name into extension and name (ex: image.jpg -> image and png)
  const parts = originalname.split(".");
  const extension = parts[parts.length - 1];
  const newPath = path + "." + extension;
  // Save the image into "uploads" folder
  fs.renameSync(path, newPath);

  const { token } = req.cookies;

  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { title, summary, content } = req.body;
    const postDoc = await postModel.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });

    res.json(postDoc);
  });
};

// TODO: Get all posts
const getAllPosts = async (req, res) => {
  const postDoc = await postModel
    .find()
    .populate("author", ["username"])
    .sort({ createdAt: -1 })
    .limit(20);

  res.json(postDoc);
};

// TODO: Get specific post by ID
const getSpecificPost = async (req, res) => {
  const { id } = req.params;
  const postDoc = await postModel.findById(id).populate("author", ["username"]);

  res.json(postDoc);
};

// TODO: Update post
const updatePost = async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    newPath = path + "." + ext;
    fs.renameSync(path, newPath);
  }

  const { token } = req.cookies;
  jwt.verify(token, secret, {}, async (err, info) => {
    if (err) throw err;
    const { id, title, summary, content } = req.body;
    const postDoc = await postModel.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json("you are not the author");
    }

    postDoc.title = title;
    postDoc.summary = summary;
    postDoc.content = content;
    postDoc.cover = newPath ? newPath : postDoc.cover;

    await postDoc.save();

    res.json(postDoc);
  });
};

module.exports = { createNewPost, getAllPosts, getSpecificPost, updatePost };
