
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async(req,res) =>{
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review)
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save()
    await listing.save()
    
    res.redirect(`/listings/${listing._id}`);

}

module.exports.destroyReview = async (req, res) => {
    let { id, reviewsId } = req.params;

    const review = await Review.findById(reviewsId);

    if (!review.author.equals(res.locals.CurrUser._id)) {
        req.flash("error", "You are not owner of this review");
        return res.redirect(`/listings/${id}`);
    }

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewsId } });
    await Review.findByIdAndDelete(reviewsId);

    res.redirect(`/listings/${id}`);
}