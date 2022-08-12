const express = require("express");
const adminRouter = express.Router();
const { User, Tweet } = require("../models");

adminRouter.get("/teresa", async (req, res) => {
  const teresa = await User.findOne({ firstname: "Teresa" })
  .populate({ path: "following", populate: { path: "tweets" } });
  //   console.log(teresa);
  res.json(teresa);
});

module.exports = adminRouter;
