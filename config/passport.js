const passport = require("passport");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local");
const { User } = require("../models");

module.exports = (app) => {
  app.use(session({ secret: process.env.APP_SECRET, resave: false, saveUninitialized: false }));
  app.use(passport.session());
  passport.use(
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "emailorusername" },
      async function (req, emailorusername, password, done) {
        const user = await User.findOne({
          $or: [{ email: emailorusername }, { username: emailorusername }],
        });
        if (!user) {
          return done(null, false, await req.flash("info", "**Credenciales erróneas**"));
        }

        const verifyPassword = await bcrypt.compare(password, user.password);
        //agregar flash-message
        if (!verifyPassword) {
          return done(null, false, await req.flash("info", "**Credenciales erróneas**"));
        }
        // console.log(user);
        return done(null, user);
      },
    ),
  );
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    const user = await User.findById(id);
    // console.log(user);
    done(null, user);
  });
};
