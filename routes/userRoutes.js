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
  const loggedUser = req.user;
  const checkingOwnProfile = req.user.id === wantedUser.id;
  const alreadyFollowing = loggedUser.following.includes(wantedUser._id);
  res.render("profile", { wantedUser, checkingOwnProfile, alreadyFollowing });
});

adminRouter.get("/follow/:username", checkAuthenticated, async (req, res) => {
  const wantedUser = await User.findOne({ username: req.params.username });
  const loggedUser = req.user;
  const notFollowing = !loggedUser.following.includes(wantedUser._id);
  const notSelf = !wantedUser._id.equals(loggedUser._id);
  if (notFollowing && notSelf) {
    await loggedUser.updateOne({ $push: { following: wantedUser._id } });
    await wantedUser.updateOne({ $push: { followers: loggedUser._id } });
  }
  res.redirect("/home");
});
adminRouter.get("/editar/:username", checkAuthenticated, userController.editProfileForm);
adminRouter.post("/edit/:username", checkAuthenticated, userController.updateProfile);

adminRouter.get("/unfollow/:username", checkAuthenticated, async (req, res) => {
  const wantedUser = await User.findOne({ username: req.params.username });
  const loggedUser = req.user;
  const alreadyFollowing = loggedUser.following.includes(wantedUser._id);
  const notSelf = !wantedUser._id.equals(loggedUser._id);
  if (alreadyFollowing && notSelf) {
    await loggedUser.updateOne({ $pull: { following: wantedUser._id } });
    await wantedUser.updateOne({ $pull: { followers: loggedUser._id } });
  }
  res.redirect("/home");
});

adminRouter.get("/siguiendo/:username", checkAuthenticated, async (req, res) => {
  const wantedUser = await User.findOne({ username: req.params.username }).populate({
    path: "following",
  });
  const following = wantedUser.following;
  res.render("following_followers", { users: following, role: "following" });
});

adminRouter.get("/seguidores/:username", checkAuthenticated, async (req, res) => {
  const wantedUser = await User.findOne({ username: req.params.username }).populate({
    path: "followers",
  });
  const followers = wantedUser.followers;
  res.render("following_followers", { users: followers, role: "followers" });
});

module.exports = adminRouter;
