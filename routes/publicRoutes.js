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
publicRouter.get("/login", async (req, res) => {
  const messages = await req.consumeFlash("info");
  res.render("login", { messages });
});
publicRouter.post("/login", authController.login);

publicRouter.get("/register", async (req, res) => {
  const messages = await req.consumeFlash("info");
  res.render("register", { messages });
});

publicRouter.post("/register", publicController.store);

module.exports = publicRouter;
