const express = require("express")
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js")
const expressErr = require("../utils/expressError.js")
const { ListingSchema } = require("../schema.js")
const Listing = require("../models/listing.js");
const { isLoggedIn } = require("../middleware.js")
const listingController = require("../controller/listing.js")

// for file upload Multer 
const multer = require('multer')
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage })
// const upload = multer({ dest: 'uploads/' })


// validator function for listing
const validateListing = (req, res, next) => {
    let { error } = ListingSchema.validate(req.body);
    if (error) {
        throw new expressErr(400, result.error.details[0].message)
    } else {
        next()
    }
}

// index Route
router.get("/", wrapAsync(listingController.index))

// New Route
router.get("/new", isLoggedIn, listingController.new)

// search route 
router.get("/search", wrapAsync(listingController.searchListing));

// show route
router.get("/:id", wrapAsync(listingController.showListing))

// create route 
router.post("/", isLoggedIn, validateListing,upload.single('listing[image]'), wrapAsync(listingController.createListing));




// edit route 
router.get("/:id/edit", isLoggedIn, wrapAsync(listingController.editListing))


// update route 
router.put("/:id", isLoggedIn,upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing));


// delete route 
router.delete("/:id", isLoggedIn, wrapAsync(listingController.destroyListing))

module.exports = router;