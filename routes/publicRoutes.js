const express = require("express");
const publicRouter = express.Router();
const authController = require("../controllers/authController");
const { User } = require("../models");
const formidable = require("formidable");
const bcrypt = require("bcryptjs");
const publicController = require("../controllers/publicController");

publicRouter.get("/", (req, res) => {
  res.render("welcome");
});
publicRouter.get("/login", (req, res) => {
  res.render("login");
});
publicRouter.post("/login", authController.login);

publicRouter.get("/register", (req, res) => {
  res.render("register");
});

publicRouter.post("/register", publicController.store);

publicRouter.get("/profile/:username", async (req, res) => {
  const wantedUser = await User.findOne({ username: req.params.username }).populate({
    path: "tweets",
  });
  const checkingOwnProfile = req.user.username === wantedUser.username;
  res.render("profile", { wantedUser, checkingOwnProfile });
});

module.exports = publicRouter;
