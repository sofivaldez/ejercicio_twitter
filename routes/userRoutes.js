const express = require("express");
const adminRouter = express.Router();
const { User, Tweet } = require("../models");
const checkAuthenticated = require("../middlewares/checkAuthenticated");
const userController = require("../controllers/userController");

adminRouter.get("/home", checkAuthenticated, userController.show);

adminRouter.get("/logout", userController.logout);

adminRouter.get("/profile/:username", checkAuthenticated, async (req, res) => {
  const wantedUser = await User.findOne({ username: req.params.username }).populate({
    path: "tweets",
  });
  const checkingOwnProfile = req.user.username === wantedUser.username;
  res.render("profile", { wantedUser, checkingOwnProfile });
});

adminRouter.get("/follow/:username", checkAuthenticated, async (req, res) => {
  const wantedUser = await User.findOne({ username: req.params.username });
  const loggedUser = await User.findById(req.user._id);
  if (!loggedUser.following.includes(wantedUser._id)) {
    await loggedUser.updateOne({ $push: { following: wantedUser._id } });
    await wantedUser.updateOne({ $push: { followers: loggedUser._id } });
  }
  res.redirect("/home");
});

module.exports = adminRouter;
