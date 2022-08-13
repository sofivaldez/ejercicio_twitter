const passport = require("passport");
const session = require("express-session");
const bcrypt = require("bcryptjs");
const LocalStrategy = require("passport-local");
const { User } = require("../models");

module.exports = (app) => {
  app.use(session({ secret: process.env.APP_SECRET, resave: false, saveUninitialized: false }));
  app.use(passport.session());
  passport.use(
    new LocalStrategy({ usernameField: "emailorusername" }, async function (
      emailorusername,
      password,
      done,
    ) {
      console.log(emailorusername, password);
      const user = await User.findOne({
        $or: [{ email: emailorusername }, { username: emailorusername }],
      });
      if (!user) {
        // console.log("usuario inexistente");
        return done(null, false, { message: "no existe ese usuario" });
      }

      const verifyPassword = await bcrypt.compare(password, user.password);
      //agregar flash-message
      if (!verifyPassword) {
        console.log("contraseña incorrecta");
        return done(null, false, { message: "contraseña incorrecta" });
      }
      // console.log(user);
      return done(null, user);
    }),
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
