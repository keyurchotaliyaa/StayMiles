const Listing = require("./models/listing.js");
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalURL;
        req.flash("error", "LogIn Required For Your Action!")
        return res.redirect("/login")
    }
    next()
}

module.exports.saveRedirectURL = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next()
}

module.exports.isOwner = (req,res,next) =>{
    if(!listing.owner.equals(res.locals.CurrUser._id)){
        req.flash("error", "You are not owner of this listing")
        return res.redirect(`/listings/${id}`)
    }
    next()
}