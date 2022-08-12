const passport = require("passport");

module.exports = {
  login: passport.authenticate("local", { successRedirect: "/teresa", failureRedirect: "/login" }),
};
