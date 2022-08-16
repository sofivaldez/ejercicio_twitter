const { User } = require("../models");
const formidable = require("formidable");
const bcrypt = require("bcryptjs");

async function welcome(req, res) {
  if (req.isAuthenticated()) return res.redirect("home");
  res.render("welcome");
}

// Display the specified resource.
async function showLogin(req, res) {
  const messages = await req.consumeFlash("info");
  res.render("login", { messages });
}

// Show the form for creating a new resource
async function create(req, res) {
  const messages = await req.consumeFlash("info");
  res.render("register", { messages });
}

// Store a newly created resource in storage.
async function store(req, res) {
  const form = formidable({
    multiples: true,
    uploadDir: __dirname + "/../public/img",
    keepExtensions: true,
  });
  form.parse(req, async (err, fields, files) => {
    const user = await User.findOne({
      $or: [{ email: fields.email }, { username: fields.username }],
    });
    if (!user) {
      const avatarField = files.avatar.originalFilename ? files.avatar.newFilename : "default.png";
      const newUser = new User({
        firstname: fields.firstname,
        lastname: fields.lastname,
        username: fields.username,
        email: fields.email,
        password: await bcrypt.hash(fields.password, 8),
        bio: fields.bio,
        avatar: avatarField,
      });
      try {
        await newUser.save();
      } catch {
        await req.flash("info", "**Faltan campos por rellenar**");
        return res.redirect("/registro");
      }
      return res.redirect("/home");
    } else {
      await req.flash("info", "**El nombre de usuario/email ya está en uso**");
      res.redirect("/registro");
    }
  });
}

module.exports = {
  welcome,
  showLogin,
  create,
  store,
};
