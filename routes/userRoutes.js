const express = require("express");
const adminRouter = express.Router();
const checkAuthenticated = require("../middlewares/checkAuthenticated");
const userController = require("../controllers/userController");

adminRouter.use(checkAuthenticated);

adminRouter.get("/home", userController.showHome);
adminRouter.get("/profile/:username", userController.showProfile);
adminRouter.get("/logout", userController.logout);
adminRouter.get("/follow/:username", userController.follow);
adminRouter.get("/unfollow/:username", userController.unfollow);
adminRouter.get("/editar/:username", userController.editProfileForm);
adminRouter.post("/edit/:username", userController.updateProfile);
adminRouter.get("/siguiendo/:username", userController.showFollowing);
adminRouter.get("/seguidores/:username", userController.showFollowers);
adminRouter.get("/deleteUser/:id", userController.destroy);
adminRouter.get("/pending", userController.showPending);

module.exports = adminRouter;
