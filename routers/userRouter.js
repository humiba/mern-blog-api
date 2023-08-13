const express = require("express");
const router = express.Router();

// Controllers list
const {
  register,
  login,
  checkIfUserLoggedIn,
  logout,
} = require("../controllers/userController");

// TODO: Register
router.post("/api/register", register);

// TODO: Login
router.post("/api/login", login);

// TODO: check If User Logged In (Get profile)
router.get("/api/profile", checkIfUserLoggedIn);

// TODO: logout
router.post("/api/logout", logout);

module.exports = router;
