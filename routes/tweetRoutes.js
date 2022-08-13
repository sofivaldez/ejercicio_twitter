const express = require("express");
const tweetRouter = express.Router();
const { User, Tweet } = require("../models");
const checkAuthenticated = require("../middlewares/checkAuthenticated");

tweetRouter.post("/tweet", checkAuthenticated, async (req, res) => {
  const newTweet = new Tweet({
    content: req.body.tweet,
    user: req.user._id,
    createdAt: new Date(),
  });
  await newTweet.save();
  await User.findByIdAndUpdate(req.user._id, { $push: { tweets: newTweet._id } });

  res.redirect("home");
});

tweetRouter.get("/deleteTweet/:id", checkAuthenticated, async (req, res) => {
  const ownTweet = req.user.tweets.includes(req.params.id);
  if (ownTweet) await Tweet.findByIdAndDelete(req.params.id);
  res.redirect("/home");
});

tweetRouter.get("/like/:id", checkAuthenticated, async (req, res) => {
  const wantedTweet = await Tweet.findById(req.params.id);
  console.log(wantedTweet);
  const alreadyLiked = wantedTweet.likes.includes(req.user._id);
  if (!alreadyLiked) await wantedTweet.updateOne({ $push: { likes: req.user._id } });
  else await wantedTweet.updateOne({ $pull: { likes: req.user._id } });
  res.redirect("/home");
});

module.exports = tweetRouter;
