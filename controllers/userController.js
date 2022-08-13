const { User, Tweet } = require("../models");
const formidable = require("formidable");
const bcrypt = require("bcryptjs");

// Display a listing of the resource.
async function index(req, res) {}

// Display the specified resource.
async function show(req, res) {
  const loggedUser = await User.findById(req.user._id).populate({
    path: "following",
    populate: { path: "tweets" },
  });
  const tweets = await Tweet.find()
    .populate({ path: "user", select: "firstname" })
    .sort({ createdAt: "desc" });
  // console.log(tweets);
  res.render("home", { loggedUser });
}

// Show the form for creating a new resource
async function create(req, res) {}

// Store a newly created resource in storage.
async function store(req, res) {}

// Show the form for editing the specified resource.
async function editProfileForm(req, res) {
  const wantedUser = await User.findOne({ username: req.params.username });

  res.render("editProfileForm", { wantedUser });
}
async function storeProfile(req, res) {
  res.send("Estoy en post");
}

// Update the specified resource in storage.
async function update(req, res) {}

// Remove the specified resource from storage.
async function destroy(req, res) {}

async function logout(req, res) {
  req.logout(function (err) {
    if (err) return next(err);
    res.redirect("/");
  });
}

module.exports = {
  index,
  show,
  create,
  store,
  editProfileForm,
  storeProfile,
  // update,
  destroy,
  logout,
};
