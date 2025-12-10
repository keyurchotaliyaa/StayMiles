const mongoose = require("mongoose");
const initData = require("./data.js")
const Listing = require("../models/listing.js");
const { init } = require("../models/user.js");

const URL = "mongodb://127.0.0.1:27017/airbnb"

main().then(() => {
    console.log("Connected to DB")
}).catch((err) => {
    console.log(err)
})
async function main() {
    await mongoose.connect(URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner : '69352594a7e6970836e19396'}))
    await Listing.insertMany(initData.data)
    console.log('Data was initialized');
}

initDB();