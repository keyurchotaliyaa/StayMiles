const express = require("express")
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const {saveRedirectURL} = require("../middleware.js")
const userController = require("../controller/user.js")

router.get("/signup", userController.formRender)

router.post("/signup", wrapAsync(userController.signUp))

router.get("/login", userController.loginFrom)

router.post(
    "/login",
    saveRedirectURL,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    userController.login
)

router.get("/logout", userController.logOut)

module.exports = router;