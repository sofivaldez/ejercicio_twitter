const passport = require("passport");
module.exports = {
  login: passport.authenticate("local", {
    failureFlash: true,
    successRedirect: "/home",
    failureRedirect: "/login",
  }),
};
