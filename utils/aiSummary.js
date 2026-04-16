

// async function generateSummary(reviews) {
//     if (!reviews || reviews.length < 3) {
//         return {
//             message: "Not enough reviews to generate summary"
//         };
//     }

//     const reviewText = reviews.map(r => r.comment).join("\n");

//     const prompt = `
//     Analyze these hotel reviews and return structured summary:

//     Reviews:
//     ${reviewText}

//     Output format:
//     Guests Love:
//     Complaints:
//     Best For:
//     Overall Sentiment (rating out of 5):
//     `;

//     const response = await client.chat.completions.create({
//         model: "gpt-4o-mini",
//         messages: [
//             { role: "user", content: prompt }
//         ],
//     });

//     return response.choices[0].message.content;
// }
console.log("GEMINI KEY:", process.env.GEMINI_API_KEY);

// const { GoogleGenerativeAI } = require("@google/generative-ai");

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// async function generateSummary(reviews) {

//     if (!reviews || reviews.length < 3) {
//         return {
//             message: "Not enough reviews to generate summary"
//         };
//     }

//     const reviewText = reviews.map(r => r.comment).join("\n");

//    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

//     const prompt = `
//     Analyze these hotel reviews and return JSON:

//     Reviews:
//     ${reviewText}

//     Format:
//     {
//       "guestsLove": "...",
//       "complaints": "...",
//       "bestFor": "...",
//       "rating": "x/5"
//     }
//     `;

//     const result = await model.generateContent(prompt);
//     const response = await result.response.text();

//     try {
//         return JSON.parse(response);
//     } catch {
//         return { message: "AI parsing failed" };
//     }
// }

async function generateSummary(reviews) {
    if (!reviews || reviews.length < 3) {
        return {
            message: "Not enough reviews to generate summary"
        };
    }

    // ✅ MOCK JSON (no API needed)
    return {
        guestsLove: "Location & Cleanliness",
        complaints: "Slow WiFi",
        bestFor: "Solo Travelers",
        rating: "4.2/5"
    };
}



module.exports = generateSummary;