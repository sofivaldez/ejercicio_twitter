const express = require("express");
const adminRouter = express.Router();
const { User, Tweet } = require("../models");
const checkAuthenticated = require("../middlewares/checkAuthenticated");
const userController = require("../controllers/userController");

adminRouter.get("/home", checkAuthenticated, userController.showHome);

adminRouter.get("/profile/:username", checkAuthenticated, userController.showProfile);

adminRouter.get("/logout", checkAuthenticated, userController.logout);

adminRouter.get("/follow/:username", checkAuthenticated, userController.follow);

adminRouter.get("/unfollow/:username", checkAuthenticated, userController.unfollow);

adminRouter.get("/editar/:username", checkAuthenticated, userController.editProfileForm);
adminRouter.post("/edit/:username", checkAuthenticated, userController.updateProfile);

adminRouter.get("/siguiendo/:username", checkAuthenticated, userController.showFollowing);

adminRouter.get("/seguidores/:username", checkAuthenticated, async (req, res) => {
  const wantedUser = await User.findOne({ username: req.params.username }).populate({
    path: "followers",
  });
  const followers = wantedUser.followers;
  res.render("following_followers", { users: followers, role: "followers" });
});

adminRouter.get("/deleteUser/:id", checkAuthenticated, userController.destroy);

adminRouter.get("/pending", (req, res) => {
  res.render("pending");
});

module.exports = adminRouter;
