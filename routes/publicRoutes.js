const express = require("express");
const publicRouter = express.Router();
const authController = require("../controllers/authController");
const { User } = require("../models");

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

publicRouter.post("/register", (req, res) => {
  const user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastName,
    username: req.body.userName, //estaría bueno que se correspondiera con el firstname, lastname
    email: req.body.email,
    password: bcrypt.hash(req.body.password, 8), //idealmente en el modelo, un hook
    bio: req.body.bio,
    avatar: "default.png",
  });
  res.send("Te has registrado correctamente");
});

module.exports = publicRouter;
