const express = require("express")
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js")
const expressErr = require("../utils/expressError.js")
const { ReviewSchema } = require("../schema.js")
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");
const review = require("../models/review.js");
const reviewController = require("../controller/review.js")




// validator function for review 
const  validateReview = (req,res,next) =>{
let {error} = ReviewSchema.validate(req.body);
if (error) {
        throw new expressErr(400, result.error.details[0].message)
    } else{
        next()
    }
}


// review post route
router.post("/",validateReview,isLoggedIn ,wrapAsync( reviewController.createReview ))

// delete route review  
router.delete("/:reviewsId", isLoggedIn, wrapAsync(reviewController.destroyReview));

module.exports = router;