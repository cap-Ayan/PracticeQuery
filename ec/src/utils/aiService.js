const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
console.log(apiKey)
if (!apiKey) { console.error("❌ Gemini API key is missing. Please set VITE_GEMINI_API_KEY in your .env file."); }
import { GoogleGenAI } from "@google/genai"; // Initialize Gemini
const ai = new GoogleGenAI({ apiKey: apiKey });

export const generateProductDetails = async (title) => {
    if (!title) {
        throw new Error("Please enter a product title first.");
    }

    

    try {
        const prompt = `
      I am adding a product to an e-commerce store. The title is "${title}".
      Please generate a compelling marketing description (max 3 sentences) for this product.
      Also, suggest a single image keyword and category.
      
      Format:
      Description: [text]
      ImageKeyword: [keyword]
      Category: [category]
    `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",   
            contents: prompt,
        });

        const text = response.text;

        const descriptionMatch = text.match(/Description:\s*(.*)/);
        const keywordMatch = text.match(/ImageKeyword:\s*(.*)/);
        const categoryMatch = text.match(/Category:\s*(.*)/);

        const description = descriptionMatch ? descriptionMatch[1].trim() : "Description generation failed.";
        const imageKeyword = keywordMatch ? keywordMatch[1].trim() : "product";
        const category = categoryMatch ? categoryMatch[1].trim() : "General";

        const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(imageKeyword)}`;

        return {
            description,
            image: imageUrl,
            category
        };

    } catch (error) {
        console.error("Gemini API Error:", error);
        throw new Error("Failed to generate content with AI. Check your API key and network connection.");
    }
};
