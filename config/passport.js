const passport = require("passport");
const LocalStrategy = require("passport-local");
const { User } = require("../models");

module.exports = () => {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, async function (email, password, done) {
      const user = await User.findOne({
        email: email,
      });
      if (!user) {
        console.log("usuario inexistente");
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
