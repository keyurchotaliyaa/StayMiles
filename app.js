require("dotenv").config();  
console.log("FULL ENV:", process.env);
console.log("MY KEY:", process.env.GEMINI_API_KEY);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressErr = require("./utils/expressError.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const user = require("./routes/user.js");


const flash = require("connect-flash");

//  DB URL from .env
const DB_URL = process.env.MONGO_URL;

//  Passport setup
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

//  View engine setup
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.set("views", path.join(__dirname, "views"));

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

//  Session (LOCALHOST SIMPLE VERSION)
const sessionOptions = {
    secret: process.env.SECRET || "mysupersecret",
    resave: false,
    saveUninitialized: true,
};

app.use(session(sessionOptions));
app.use(flash());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//  Connect DB
async function main() {
    await mongoose.connect(DB_URL);
    console.log("✅ Connected to DB");
}
main().catch(err => console.log(err));

//  Global locals
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.CurrUser = req.user;
    next();
});

// ROUTES
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", user);

// HOME ROUTE (added to avoid 404 confusion)
app.get("/", (req, res) => {
    res.send("App is working 🚀");
});

//Demo routes
app.get("/demouser", async (req, res) => {
    let user1 = new User({
        email: "abc@gmail.com",
        username: "keyur@1234"
    });

    let user1data = await User.register(user1, "Keyur@1911");
    res.send(user1data);
});

app.get("/testlisting", async (req, res) => {
    let sampleListing = new Listing({
        title: "This is First Listing",
        description: "Good Good Good",
        price: 1200,
        location: "Surat",
        country: "India"
    });

    await sampleListing.save();
    res.send("Listing Created ✅");
});

//Track USer Behaviour
app.use((req, res, next) => {
    if (!req.session.userActivity) {
        req.session.userActivity = {};
    }
    next();
});

// 404 handler
app.use((req, res, next) => {
    next(new expressErr(404, "Page Not Found!"));
});

// Error handler
app.use((err, req, res, next) => {
    console.log("🔥 ERROR >>>", err);
    const { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("listings/error.ejs", { message, status });
});



//  Server start
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});


