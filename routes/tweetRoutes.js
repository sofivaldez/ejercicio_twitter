const express = require("express");
const tweetRouter = express.Router();
const tweetController = require("../controllers/tweetController");
const checkAuthenticated = require("../middlewares/checkAuthenticated");

tweetRouter.post("/tweet", checkAuthenticated, tweetController.store);
tweetRouter.get("/like/:id", checkAuthenticated, tweetController.update);
tweetRouter.get("/tweet/:id", checkAuthenticated, tweetController.destroy);

module.exports = tweetRouter;
