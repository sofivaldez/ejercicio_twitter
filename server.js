require("dotenv").config();

const passport = require("passport");
const session = require("express-session");
const express = require("express");
const routes = require("./routes");
const dbInitialSetup = require("./seeders/seeder");
const APP_PORT = process.env.APP_PORT || 3000;
const app = express();

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(session({ secret: process.env.APP_SECRET, resave: false, saveUninitialized: false }));
routes(app);
app.use(passport.session());

dbInitialSetup(); // Crea tablas e inserta datos de prueba.

app.listen(APP_PORT, () => {
  console.log(`\n[Express] Servidor corriendo en el puerto ${APP_PORT}.`);
  console.log(`[Express] Ingresar a http://localhost:${APP_PORT}.\n`);
});
