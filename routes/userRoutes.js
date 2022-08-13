const express = require("express");
const adminRouter = express.Router();
const { User, Tweet } = require("../models");
const checkAuthenticated = require("../middlewares/checkAuthenticated");
const userController = require("../controllers/userController");

adminRouter.get("/home", checkAuthenticated, userController.show);

adminRouter.get("/logout", checkAuthenticated, userController.logout);

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
  const notFollowing = !loggedUser.following.includes(wantedUser._id);
  const notSelf = !wantedUser._id.equals(req.user._id);
  if (notFollowing && notSelf) {
    await loggedUser.updateOne({ $push: { following: wantedUser._id } });
    await wantedUser.updateOne({ $push: { followers: loggedUser._id } });
  }
  res.redirect("/home");
});
adminRouter.get("/editar/:username", userController.editProfileForm);
adminRouter.post("/edit/:username", userController.storeProfile);
//faltacheckAuthenticated

adminRouter.get("/unfollow/:username", checkAuthenticated, async (req, res) => {
  const wantedUser = await User.findOne({ username: req.params.username });
  const loggedUser = await User.findById(req.user._id);
  const alreadyFollowing = loggedUser.following.includes(wantedUser._id);
  const notSelf = !wantedUser._id.equals(req.user._id);
  if (alreadyFollowing && notSelf) {
    await loggedUser.updateOne({ $pull: { following: wantedUser._id } });
    await wantedUser.updateOne({ $pull: { followers: loggedUser._id } });
  }
  res.redirect("/home");
});

adminRouter.post("/tweet", async (req, res) => {
  const newTweet = new Tweet({ content: req.body.tweet, user: req.user._id });
  await newTweet.save();
  const loggedUser = await User.findByIdAndUpdate(req.user._id);
  await loggedUser.updateOne({ $push: { tweets: newTweet._id } });
  res.redirect("home");
});

module.exports = adminRouter;
