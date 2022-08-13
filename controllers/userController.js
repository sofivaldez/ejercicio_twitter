const { User } = require("../models");
const formidable = require("formidable");
const bcrypt = require("bcryptjs");

// Display a listing of the resource.
async function index(req, res) {}

// Display the specified resource.
async function show(req, res) {}

// Show the form for creating a new resource
async function create(req, res) {}

// Store a newly created resource in storage.
async function store(req, res) {}

// Show the form for editing the specified resource.
async function edit(req, res) {}

// Update the specified resource in storage.
async function update(req, res) {}

// Remove the specified resource from storage.
async function destroy(req, res) {}

// Otros handlers...
async function storeUser(req, res) {
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
    await newUser.save();
    res.redirect("/");
  });
}

module.exports = {
  index,
  show,
  create,
  store,
  edit,
  update,
  destroy,
  storeUser,
};
