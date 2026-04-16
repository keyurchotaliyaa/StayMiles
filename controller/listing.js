const Listing = require("../models/listing.js");
const getSafetyScore = require("../utils/safetyScore");
const getNearbyData = require("../utils/nearBy");

module.exports.index = async (req, res) => {
    const search = req.query.search?.trim();
    const filter = req.query.filter;

    let allListings;

    // 🔍 PRIORITY 1 → SEARCH
    if (search) {
        allListings = await Listing.find({
            $or: [
                { title: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
                { country: { $regex: search, $options: "i" } }
            ]
        });
    }

    // 🎯 PRIORITY 2 → FILTER (random)
    else if (filter) {
        allListings = await Listing.aggregate([{ $sample: { size: 4 } }]);
    }

    // 📦 DEFAULT → ALL
    else {
        allListings = await Listing.find({});
    }

    res.render("listings/index.ejs", { allListings, search });
};

module.exports.new = (req, res) => {
        res.render("listings/new.ejs")
}

// module.exports.showListing = async (req, res) => {
//     let { id } = req.params;
//     const listing = await Listing.findById(id).populate({path:"reviews",populate: {path:"author"}}).populate("owner");
    
    
//     if (!listing) {
//         req.flash("error", "Requested Listing Does Not Exist!");
//         return res.redirect("/listings/");
//     }
//     console.log(listing);
//     res.render("listings/show.ejs", { listing })
// }

const generateSummary = require("../utils/aiSummary");

module.exports.showListing = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({ path: "reviews", populate: { path: "author" } })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Requested Listing Does Not Exist!");
        return res.redirect("/listings/");
    }

        // 💰 Price Breakdown Logic
        const basePrice = listing.price;

        const tax = Math.round(basePrice * 0.18); // 18% GST
        const serviceFee = 100; // fixed

        const totalPrice = basePrice + tax + serviceFee;

        //nearBy Data
        const nearby = await getNearbyData(listing.location);

    //safety score
    const safetyScore = await getSafetyScore(listing.reviews);

    //AI summary
    const aiSummary = await generateSummary(listing.reviews);

        res.render("listings/show.ejs", {
        listing,
        aiSummary,
        safetyScore,
        basePrice,
        tax,
        serviceFee,
        totalPrice, nearby
    });
};

module.exports.createListing = async (req, res, next) => {
    if (!req.body.listing) {
        throw new expressErr(400, "Enter Valid Data!")
    }
    // let result = ListingSchema.validate(req.body);
    // if (result.error) {
    //     throw new expressErr(400, result.error.details[0].message)
    // }
    let url = req.file.path;
    let filename = req.file.filename;
   
    
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {filename,url}
    req.flash("success", "New Listing Created!")
    await newListing.save();
    res.redirect("/listings");
}

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Requested Listing Does Not Exist!");
        return res.redirect("/listings/");
    }
    res.render("listings/edit.ejs", { listing })
}

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    // extract image separately
    const { image, ...otherData } = req.body.listing;
    // reconstruct the image object with correct key order (filename, url)
     let url = req.file.path;
    let filename = req.file.filename;

    const updatedListing = await Listing.findByIdAndUpdate(
        id,
        {
            ...otherData,
            image: {
                filename: filename,   // keep same or set dynamically if needed
                url: url
            }
        },
        { new: true }
    );
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!")
    res.redirect(`/listings/`)

}



