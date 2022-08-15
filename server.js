require("dotenv").config();

const passportConfig = require("./config/passport");
const express = require("express");
const routes = require("./routes");
const dbInitialSetup = require("./seeders/seeder");
const APP_PORT = process.env.APP_PORT || 3000;
const app = express();
const { flash } = require("express-flash-message");
const methodOverride = require("method-override");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
passportConfig(app);
app.use(flash({ sessionKeyName: "flashMessage" }));
routes(app);

// dbInitialSetup(); // Crea tablas e inserta datos de prueba.

app.listen(APP_PORT, () => {
  console.log(`\n[Express] Servidor corriendo en el puerto ${APP_PORT}.`);
  console.log(`[Express] Ingresar a http://localhost:${APP_PORT}.\n`);
});
