const express = require("express");
const adminRouter = express.Router();
const { User, Tweet } = require("../models");
const checkAuthenticated = require("../middlewares/checkAuthenticated");
const userController = require("../controllers/userController");

adminRouter.get("/home", checkAuthenticated, userController.show);

adminRouter.get("/logout", userController.logout);

module.exports = adminRouter;
