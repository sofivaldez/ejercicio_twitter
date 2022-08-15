const { User, Tweet } = require("../models");
const formidable = require("formidable");
const bcrypt = require("bcryptjs");
const _ = require("lodash");

async function showHome(req, res) {
  const loggedUser = req.user;
  const wantedTweets = await Tweet.find({ user: { $in: loggedUser.following } })
    .populate({ path: "user" })
    .sort({ createdAt: "desc" })
    .limit(20);
  const ownTweets = await Tweet.find({ user: loggedUser._id }).sort({ createdAt: "desc" }).limit(5);
  const recommendedUsers = await User.find({ _id: { $nin: loggedUser.following } }).limit(20);
  res.render("home", { loggedUser, wantedTweets, recommendedUsers, ownTweets });
}

async function showProfile(req, res) {
  const wantedUser = await User.findOne({ username: req.params.username }).populate({
    path: "tweets",
  });
  const loggedUser = req.user;
  const checkingOwnProfile = req.user.id === wantedUser.id;
  const alreadyFollowing = loggedUser.following.includes(wantedUser._id);
  res.render("profile", { wantedUser, checkingOwnProfile, alreadyFollowing, loggedUser });
}

// Show the form for creating a new resource
async function follow(req, res) {
  const wantedUser = await User.findOne({ username: req.params.username });
  const loggedUser = req.user;
  const notFollowing = !loggedUser.following.includes(wantedUser._id);
  const notSelf = !wantedUser._id.equals(loggedUser._id);
  if (notFollowing && notSelf) {
    await loggedUser.updateOne({ $push: { following: wantedUser._id } });
    await wantedUser.updateOne({ $push: { followers: loggedUser._id } });
  }
  res.redirect("/home");
}

async function unfollow(req, res) {
  const wantedUser = await User.findOne({ username: req.params.username });
  const loggedUser = req.user;
  const alreadyFollowing = loggedUser.following.includes(wantedUser._id);
  const notSelf = !wantedUser._id.equals(loggedUser._id);
  if (alreadyFollowing && notSelf) {
    await loggedUser.updateOne({ $pull: { following: wantedUser._id } });
    await wantedUser.updateOne({ $pull: { followers: loggedUser._id } });
  }
  res.redirect("/home");
}

async function editProfileForm(req, res) {
  const loggedUser = req.user;
  const notSelf = req.params.username !== loggedUser.username;

  if (notSelf) {
    return res.redirect("/");
  }
  const wantedUser = await User.findOne({ username: req.params.username });

  res.render("editProfileForm", { wantedUser });
}

async function updateProfile(req, res) {
  const loggedUser = req.user;
  const notSelf = req.params.username !== loggedUser.username;

  if (notSelf) {
    return res.redirect("/");
  }

  const form = formidable({
    multiples: true,
    uploadDir: __dirname + "/../public/img",
    keepExtensions: true,
  });
  form.parse(req, async (err, fields, files) => {
    const update = files.avatar.newFilename
      ? {
          firstname: fields.firstname,
          lastname: fields.lastname,
          bio: fields.bio,
          avatar: files.avatar.newFilename,
        }
      : { firstname: fields.firstname, lastname: fields.lastname, bio: fields.bio };
    await req.user.updateOne(update);
    res.redirect(`/profile/${req.user.username}`);
  });
}

async function showFollowing(req, res) {
  const wantedUser = await User.findOne({ username: req.params.username }).populate({
    path: "following",
  });
  const following = wantedUser.following;
  res.render("following_followers", { users: following, role: "following" });
}

async function showFollowers(req, res) {
  const wantedUser = await User.findOne({ username: req.params.username }).populate({
    path: "followers",
  });
  const followers = wantedUser.followers;
  res.render("following_followers", { users: followers, role: "followers" });
}

async function destroy(req, res) {
  if (req.user.id !== req.params.id) return res.redirect("back");
  await Tweet.deleteMany({ user: req.params.id });
  await User.updateMany({}, { $pull: { following: req.params.id } });
  await User.updateMany({}, { $pull: { followers: req.params.id } });
  await User.findByIdAndDelete(req.params.id);
  res.redirect("/logout");
}

function logout(req, res) {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect("/");
  });
}

function showPending(req, res) {
  res.render("pending");
}

module.exports = {
  showHome,
  showProfile,
  follow,
  unfollow,
  editProfileForm,
  updateProfile,
  showFollowing,
  showFollowers,
  destroy,
  logout,
  showPending,
};
