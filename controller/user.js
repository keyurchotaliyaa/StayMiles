
const User = require("../models/user.js");
module.exports.formRender = (req, res) => {
    res.render("user/signup.ejs")
}

module.exports.signUp = async (req, res) => {
    try {
        let { email, username, password } = req.body;
        let newuser = new User({ email, username })
        let registereduser = await User.register(newuser, password)
        req.login(registereduser, (err) => {
            if (err) {
                next(err);
            }
            req.flash("success", "Welcome to StayMiles")
            res.redirect("/listings")
        })
    } catch (e) {
        req.flash("error", e.message)
        res.redirect("/signup")
    }

}

module.exports.loginFrom = (req, res) => {
    res.render("user/login.ejs")
}

module.exports.login = async (req, res) => {
        req.flash("success", "Welcome Back To StayMiles!")
        res.redirect(res.locals.redirectUrl || "/listings")
    }

module.exports.logOut = (req, res, next) => {
    req.logOut((err) => {
        if(err){
            next(err)
        }
        req.flash("error", "You Are LogOut!")
        res.redirect("/listings")
    })
}