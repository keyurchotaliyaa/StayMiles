require("dotenv").config();

const fetch = require("node-fetch");

async function listModels() {
    const res = await fetch(
        `https://generativelanguage.googleapis.com/v1/models?key=${process.env.GEMINI_API_KEY}`
    );

    const data = await res.json();

    console.log(data);
}

listModels();