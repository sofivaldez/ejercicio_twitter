const express = require("express");
const publicRouter = express.Router();
const authController = require("../controllers/authController");
const { User } = require("../models");
const formidable = require("formidable");
const bcrypt = require("bcryptjs");

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

publicRouter.post("/register", async (req, res) => {
  const form = formidable({
    multiples: true,
    uploadDir: __dirname + "/../public/img",
    keepExtensions: true,
  });
  form.parse(req, async (err, fields, files) => {
    const avatarField = files.avatar.originalFilename ? files.newFilename : null;
    const newUser = new User({
      firstname: fields.firstname,
      lastname: fields.lastname,
      username: fields.username,
      email: fields.email,
      password: await bcrypt.hash(fields.password, 8),
      bio: fields.bio,
      avatar: avatarField,
    });
    console.log(newUser);
    await newUser.save();
    res.redirect("/");
  });
});

module.exports = publicRouter;
