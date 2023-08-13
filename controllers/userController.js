const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { userModel } = require("../models/userModel");
const salt = bcrypt.genSaltSync(10);
const secret = "asdfe45we45w345wegw345werjktjwertkj";

// TODO: Register
const register = async (req, res) => {
  const { email, username, password } = req.body;

  if (!email | !username | !password) {
    return res.status(400).json({ message: "Please enter all the fields" });
  }

  try {
    const userDoc = await userModel.create({
      email,
      username,
      password: bcrypt.hashSync(password, salt),
    });

    if (!userDoc) {
      return res.status(500).json(userDoc);
    }

    // Registration successfully!!!
    res.status(201).json(userDoc);
  } catch (err) {
    // Check if email or username is existing in DB
    if (err.keyPattern.username === 1 || err.keyPattern.email === 1) {
      return res.status(409).json({
        message:
          "Cannot sign up! Please try again with other username and email.",
      });
    }
    res
      .status(500)
      .json({ err, message: "Registration failed! Please try again" });
  }
};

// TODO: Login
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email | !password) {
    return res.status(400).json({ message: "Please enter all the fields" });
  }

  try {
    // Find user by email
    const userDoc = await userModel.findOne({
      email: email,
    });

    if (!userDoc) {
      return res
        .status(401)
        .json({ message: "Invalid email! Please try again" });
    }

    const isValidPassword = bcrypt.compareSync(password, userDoc.password);

    if (isValidPassword) {
      jwt.sign(
        { id: userDoc._id, email, username: userDoc.username },
        secret,
        {},
        (err, token) => {
          if (err) {
            throw err;
          }
          res.cookie("token", token).json({
            id: userDoc._id,
            email,
            username: userDoc.username,
          });
        }
      );
    } else {
      res.status(400).json("wrong credentials");
    }
  } catch (err) {
    res.status(400).json({ err, message: "Wrong Credentials" });
  }
};

// TODO: check if user logged in
const checkIfUserLoggedIn = (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, secret, {}, (err, info) => {
    if (err) throw err;
    res.json(info);
  });
};

// TODO: Logout
const logout = (req, res) => { 
  res.cookie("token", "").json("Logout successfully");
};

module.exports = { register, login, checkIfUserLoggedIn, logout };
