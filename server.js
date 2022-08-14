require("dotenv").config();

const passportConfig = require("./config/passport");
const express = require("express");
const routes = require("./routes");
const dbInitialSetup = require("./seeders/seeder");
const APP_PORT = process.env.APP_PORT || 3000;
const app = express();
const { flash } = require("express-flash-message");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
passportConfig(app);
app.use(flash({ sessionKeyName: "flashMessage" }));
routes(app);

//Cosas de flash-message

app.get("/flash", async function (req, res) {
  // Set a flash message by passing the key, followed by the value, to req.flash().
  await req.flash("info", "Flash is back!");
  res.redirect("/");
});

// dbInitialSetup(); // Crea tablas e inserta datos de prueba.

app.listen(APP_PORT, () => {
  console.log(`\n[Express] Servidor corriendo en el puerto ${APP_PORT}.`);
  console.log(`[Express] Ingresar a http://localhost:${APP_PORT}.\n`);
});
