const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings })
}

module.exports.new = (req, res) => {
        res.render("listings/new.ejs")
}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path:"reviews",populate: {path:"author"}}).populate("owner");
    
    
    if (!listing) {
        req.flash("error", "Requested Listing Does Not Exist!");
        return res.redirect("/listings/");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing })
}

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
module.exports.searchListing = async (req, res) => {
    const { q } = req.query;

    if (!q || q.trim() === "") {
        req.flash("error", "Enter Proper Name of Property.");
        return res.redirect("/listings");
    }

    const listing = await Listing.findOne({
        title: q.trim()
    });

    if (!listing) {
        req.flash("error", "Enter Proper Name of Property.");
        return res.redirect("/listings");
    }

    return res.redirect(`/listings/${listing._id}`);
};


