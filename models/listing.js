const mongoose = require("mongoose");
const Review = require("./review");
const { required } = require("joi");
const Schema = mongoose.Schema;

const ListingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        filename: String,
        url: String,
        },
    price: Number,
    location: String,
    country: String,
    reviews:[{
        type: Schema.Types.ObjectId,
        ref: "Review",
    }],
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    }
})

// Delete many reviews
ListingSchema.post("findOneAndDelete", async(listing)=>{
    if (listing){
    await Review.deleteMany({_id: {$in : listing.reviews}})
    }
})

const Listing = new mongoose.model("Listing", ListingSchema);
module.exports = Listing;



