const express = require("express");
const publicRouter = express.Router();
const authController = require("../controllers/authController");

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

module.exports = publicRouter;
