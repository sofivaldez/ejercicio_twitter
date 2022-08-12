const express = require("express");
const publicRouter = express.Router();
const { login } = require("../middlewares/authenticate");

publicRouter.get("/", (req, res) => {
  res.render("welcome");
});
publicRouter.get("/login", (req, res) => {
  res.render("login");
});
publicRouter.post("/login", login);

publicRouter.get("/register", (req, res) => {
  res.render("register");
});

module.exports = publicRouter;
