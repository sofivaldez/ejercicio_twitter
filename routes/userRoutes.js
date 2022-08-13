const express = require("express");
const adminRouter = express.Router();
const { User, Tweet } = require("../models");
const checkAuthenticated = require("../middlewares/checkAuthenticated");

adminRouter.get("/home", checkAuthenticated, async (req, res) => {
  const teresa = await User.findOne({ firstname: "Teresa" }).populate({
    path: "following",
    populate: { path: "tweets" },
  });
  //   console.log(teresa);
  res.json(teresa);
});

module.exports = adminRouter;
