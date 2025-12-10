const express = require("express")
const app = express();
const mongoose = require("mongoose");
const session = require("express-session")
const MongoStore = require("connect-mongo")
const Listing = require("./models/listing.js");
const path = require("path")
const methodOverride = require("method-override")
const ejsMate = require("ejs-mate")
const wrapAsync = require("./utils/wrapAsync.js")
const expressErr = require("./utils/expressError.js")
const Review = require("./models/review.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const user = require("./routes/user.js");

const flash = require("connect-flash")



const URL = process.env.MONGO_ATLAS;



// for env
if (process.env.NODE_ENV != "production") {
    require('dotenv').config()
}


// for passport 
const passport = require("passport")
const LocalStrategy = require("passport-local")
const User = require("./models/user.js")

app.set("view engine", "ejs")
app.engine("ejs", ejsMate)
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"))
app.use(express.static(path.join(__dirname, "/public")));

// Create Mongo store on cloud 
const store = MongoStore.create({
    mongoUrl: URL,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600,  
})


store.on("error", function (e) {
    console.log("SESSION STORE ERROR ❌", e);
});


// create session
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expiers: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
}



// session & flash
app.use(session(sessionOptions))
app.use(flash())

// for passport 
app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




main().then(() => {
    console.log("Connected to DB")
}).catch((err) => {
    console.log(err)
})
async function main() {
    await mongoose.connect(URL);
}


// locals 
app.use((req, res, next) => {
    res.locals.success = req.flash("success")
    res.locals.error = req.flash("error")
    res.locals.CurrUser = req.user;
    next()
})
// routes
app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/", user);

// Demo user
app.get("/demouser", async (req, res) => {
    let user1 = new User({
        email: "abc@gmail.com",
        username: "keyur@1234"
    })

    let user1data = await User.register(user1, "Keyur@1911")
    res.send(user1data)

})

app.get("/testlisting", async (req, res) => {
    let sampleListing = new Listing({
        title: "This is First Listing ",
        description: "Good Good Good",
        price: 1200,
        location: "pasodra, Surat",
        country: "India"
    })

    await sampleListing.save();
    console.log('Sample was saaved');
    res.send("Done Beta")
})

app.use((req, res, next) => {
    next(new expressErr(404, "Page Not Found!"));
});

app.use((err, req, res, next) => {
    console.log("🔥 REAL ERROR >>>", err);
    const { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("listings/error.ejs", { message, status });
});

app.listen("8080",
    () => {
        console.log("server is listning");
    })


