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

module.exports = publicRouter;
