// utils/safetyScore.js

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// RULE-BASED FUNCTION (always works)
function ruleBasedScore(reviews) {
    if (!reviews || reviews.length === 0) return 5;

    const keywords = ["safe", "secure", "unsafe", "danger", "night", "area"];

    let score = 5;

    reviews.forEach(r => {
        const text = r.comment.toLowerCase();

        if (text.includes("safe") || text.includes("secure")) score += 1;
        if (text.includes("unsafe") || text.includes("danger")) score -= 1;
    });

    return Math.max(1, Math.min(10, score));
}

// AI FUNCTION 
async function aiScore(reviews) {
    try {
        if (!reviews || reviews.length < 3) return null;

        const model = genAI.getGenerativeModel({
            model: "gemini-1.0-pro"
        });

        const reviewText = reviews.map(r => r.comment).join("\n");

        const prompt = `
        Based on these reviews, give ONLY safety score from 1 to 10.

        Reviews:
        ${reviewText}

        Output: number only
        `;

        const result = await model.generateContent(prompt);
        const text = await result.response.text();

        const num = parseFloat(text);

        if (isNaN(num)) return null;

        return Math.max(1, Math.min(10, num));

    } catch (err) {
        console.log("AI ERROR:", err.message);
        return null;
    }
}

// MAIN FUNCTION
async function getSafetyScore(reviews) {
    let ai = await aiScore(reviews);

    if (ai !== null) return ai;

    // fallback
    return ruleBasedScore(reviews);
}

module.exports = getSafetyScore;