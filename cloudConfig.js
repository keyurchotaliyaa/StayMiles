
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


console.log(process.env.CLOUDINARY_API_KEY);
console.log(process.env.CLOUD_NAME);
console.log(process.env.CLOUDINARY_API_SECRET);



const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "StayMiles",
        allowed_formats: ["jpg", "png", "jpeg", "webp"]
    }
});

module.exports = { cloudinary, storage };
