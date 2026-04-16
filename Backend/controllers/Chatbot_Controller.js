import { GoogleGenAI } from "@google/genai";
import redis from "../middlewares/Redis.js";
import { getAllProducts } from "../models/product_model.js";

const ai = new GoogleGenAI({});

const SITE_URL = "https://www.poshakfabrics.org";

// Real company information — used in chatbot system prompt
const COMPANY_INFO = `
COMPANY: Poshak Fabrics
WEBSITE: https://www.poshakfabrics.org
ABOUT: Poshak Fabrics is a premium ethnic wear brand based in Pakistan. We offer a unique blend of traditional and modern design. Our fabrics are handcrafted with care and attention to detail, ensuring that each piece is a work of art. We are committed to providing customers with the best possible experience.
EMAIL: fabricsposhak8@gmail.com
PHONE: +92 316 7986273
ADDRESS: Qadirabad, Pakistan
DELIVERY: We deliver across Pakistan.
LANGUAGES: English and Urdu support available.
COLLECTIONS: We sell stitched suits, unstitched fabric, lawn, silk, cotton and other ethnic wear.
CONTACT PAGE: https://www.poshakfabrics.org/#contact
`;

export const chatbotController = async (req, res) => {
    try {
        const { message } = req.body;

        // Get products from Redis cache; fall back to DB if not cached
        let products;
        const cached = await redis.get("products");
        if (cached) {
            products = typeof cached === "string" ? JSON.parse(cached) : cached;
        } else {
            products = await getAllProducts();
        }

        // Build a clean, slim product summary for Gemini (avoids token overload)
        const productContext = products.map((p) => ({
            id: p.id,
            name: p.name,
            type: p.type,
            category: p.category,
            price: p.price,
            after_discount: p.after_discou,
            discount: p.discount_perc ? `${p.discount_perc}% off` : null,
            description: p.description,
            status: p.status,
            link: `${SITE_URL}/user/collections/${encodeURIComponent(p.type)}/${p.id}`,
        }));

        const response = await ai.models.generateContent({
            model: "gemini-3-flash-preview",
            contents: [
                {
                    role: "user",
                    parts: [{ text: message }]
                }
            ],
            config: {
                systemInstruction: `
You are a helpful shopping assistant for "Poshak Fabrics", a Pakistani fabric store.

STRICT RULES:
- You ONLY answer questions related to Poshak Fabrics — its products, company info, contact, location, and delivery.
- Use ONLY the product data and company info provided below. Do NOT use your own knowledge.
- If the user asks about anything completely unrelated (phones, laptops, skincare, etc.), reply: "I only help with Poshak Fabrics products and services. 😊"
- NEVER recommend products outside the given data.

RESPONSE FORMAT:
- Answer in 2-3 SHORT sentences only. No long lists.
- Always include the product's direct link when recommending a product.
- Plain text only — no markdown, no asterisks, no bullet points, no headings.
- Be warm and concise like a helpful shop assistant.

EXAMPLE PRODUCT ANSWER:
"Try the Floral Breeze suit — it's a stitched lawn piece for Rs. 1,999 (15% off). Here's the link: https://www.poshakfabrics.org/user/collections/stitched/42"

EXAMPLE CONTACT ANSWER:
"You can reach us at fabricsposhak8@gmail.com or call +92 316 7986273. We're based in Qadirabad, Pakistan."

COMPANY INFORMATION:
${COMPANY_INFO}

PRODUCT DATA:
${JSON.stringify(productContext)}
`,
            },
        });

        return res.status(200).json({ text: response.text });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ text: "Something went wrong. Please try again." });
    }
}
