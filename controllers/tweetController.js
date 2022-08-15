const { User, Tweet } = require("../models");

module.exports = {
  store: async (req, res) => {
    const newTweet = new Tweet({
      content: req.body.tweet,
      user: req.user._id,
    });
    try {
      await newTweet.save();
    } catch {
      return res.redirect("home");
    }
    await User.findByIdAndUpdate(req.user._id, { $push: { tweets: newTweet._id } });

    res.redirect("home");
  },
  update: async (req, res) => {
    const wantedTweet = await Tweet.findById(req.params.id);
    const alreadyLiked = wantedTweet.likes.includes(req.user._id);
    if (!alreadyLiked) await wantedTweet.updateOne({ $push: { likes: req.user._id } });
    else await wantedTweet.updateOne({ $pull: { likes: req.user._id } });
    res.redirect("back");
  },
  destroy: async (req, res) => {
    const ownTweet = req.user.tweets.includes(req.params.id);
    if (ownTweet) await Tweet.findByIdAndDelete(req.params.id);
    await req.user.updateOne({ $pull: { tweets: req.params.id } });
    res.redirect("back");
  },
};
