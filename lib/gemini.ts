import { coupons } from '../data/coupons';

const GEMINI_API_KEY = 'AIzaSyABpj3wUwAV4CTZEbxEGTmTv2gkmCZN8XY';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

interface SparkyAction {
    type: 'add_to_cart' | 'navigate' | 'none';
    productId?: string;
    productName?: string;
    quantity?: number;
}

interface SparkyResponse {
    text: string;
    actions: SparkyAction[];
}

export const generateSparkyResponse = async (
    query: string,
    products: any[],
    userPreferences: any,
    chatHistory: { role: string; text: string }[]
): Promise<SparkyResponse> => {
    try {
        // 1. Prepare Context
        const productCatalog = products.map(p =>
            `${p.id}: ${p.name} (${p.category}) - $${p.price} [Aisle: ${p.aisle}] [Tags: ${p.tokens?.join(', ')}]`
        ).join('\n');

        const allergies = userPreferences.allergens.map((a: any) => a.allergen).join(', ');
        const diets = userPreferences.diets?.join(', ') || 'none';
        const customAvoid = userPreferences.customAvoid?.join(', ') || 'none';

        const couponList = coupons.map(c =>
            `${c.code}: ${c.description} (${c.discountType === 'fixed' ? '$' + c.discountValue + ' off' : c.discountValue + '% off'})`
        ).join('\n');

        const historyText = chatHistory.map(msg => `${msg.role}: ${msg.text}`).join('\n');

        const systemPrompt = `
You are Sparky, a helpful and friendly grocery store assistant.
Your goal is to help the user shop, find items, check for allergies, and suggest recipes.

**User Profile:**
- Allergies: ${allergies}
- Diets: ${diets}
- Dislikes/Avoid: ${customAvoid}

**Store Catalog (Available Items):**
${productCatalog}

**Available Coupons:**
${couponList}

**Conversation History:**
${historyText}

**Instructions:**
1. **Analyze the user's request** in the context of the history.
2. **Check for Safety:** If the user asks to add an item that conflicts with their allergies/diets, WARN them in the 'text' response and DO NOT generate an 'add_to_cart' action for it unless they explicitly override.
3. **Recipe Logic:**
   - If the user asks for a dish (e.g., "Chicken Tikka"), check if they specified a **serving size** (e.g., "for 4 people").
   - **If NO serving size is known**: Ask "How many people are you cooking for?" and **DO NOT** add items yet.
   - **If serving size IS known**: Identify ingredients and **scale quantities** (e.g., 1 lb meat serves 2-3). Set the \`quantity\` field in the JSON actions.
   - **IMPORTANT**: When adding items (especially multiple ingredients), **explicitly list the item names and quantities** in your \`text\` response so the user knows exactly what is being added.
4. **Budget Mode:**
   - If the user sets a budget (e.g., "under $25"):
     - **Prioritize Price**: Select the cheapest valid product for each ingredient.
     - **Apply Coupons**: Check if any coupons apply.
     - **Calculate Total**: Sum the prices. If > budget, warn the user.
     - **Report**: Mention the total and any coupons found.
5. **Output Format:** You must return ONLY a valid JSON object. Do not include markdown formatting (no \`\`\`json).
6. **Response Style:** Be conversational, brief, and helpful. Speak like a friendly robot.

**JSON Schema:**
{
    "text": "The spoken response to the user.",
    "actions": [
        {
            "type": "add_to_cart",
            "productId": "prod-id",
            "quantity": 2
        }
    ]
}

**User Query:** "${query}"
`;

        // 2. Call Gemini API
        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: systemPrompt }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    responseMimeType: "application/json"
                }
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini API Error:', errorText);
            throw new Error('Gemini API request failed');
        }

        const data = await response.json();
        const resultText = data.candidates[0].content.parts[0].text;

        // 3. Parse JSON
        try {
            const parsed = JSON.parse(resultText);
            return parsed;
        } catch (e) {
            console.error('Failed to parse Gemini JSON:', resultText);
            return {
                text: "I'm having a little trouble processing that right now. Could you try again?",
                actions: []
            };
        }

    } catch (error) {
        console.error('Sparky Brain Error:', error);
        return {
            text: "I'm sorry, my brain is a bit foggy. Please try again.",
            actions: []
        };
    }
};

export const generateSparkyAudioResponse = async (
    audioBase64: string,
    products: any[],
    userPreferences: any,
    chatHistory: { role: string; text: string }[]
): Promise<SparkyResponse> => {
    try {
        const productCatalog = products.map(p =>
            `${p.id}: ${p.name} (${p.category}) - $${p.price} [Aisle: ${p.aisle}] [Tags: ${p.tokens?.join(', ')}]`
        ).join('\n');

        const allergies = userPreferences.allergens.map((a: any) => a.allergen).join(', ');
        const diets = userPreferences.diets?.join(', ') || 'none';
        const customAvoid = userPreferences.customAvoid?.join(', ') || 'none';
        const couponList = coupons.map(c =>
            `${c.code}: ${c.description} (${c.discountType === 'fixed' ? '$' + c.discountValue + ' off' : c.discountValue + '% off'})`
        ).join('\n');
        const historyText = chatHistory.map(msg => `${msg.role}: ${msg.text}`).join('\n');

        const systemPrompt = `
You are Sparky, a helpful and friendly grocery store assistant.
Your goal is to help the user shop, find items, check for allergies, and suggest recipes.

**User Profile:**
- Allergies: ${allergies}
- Diets: ${diets}
- Dislikes/Avoid: ${customAvoid}

**Store Catalog (Available Items):**
${productCatalog}

**Conversation History:**
${historyText}

**Instructions:**
1. **Listen/Read the user's request.**
2. **Analyze the request** in context.
3. **Check for Safety:** Warn about allergies.
4. **Recipe Logic:**
   - If the user asks for a dish (e.g., "Chicken Tikka"), check if they specified a **serving size** (e.g., "for 4 people").
   - **If NO serving size is known**: Ask "How many people are you cooking for?" and **DO NOT** add items yet.
   - **If serving size IS known**: Identify ingredients and **scale quantities** (e.g., 1 lb meat serves 2-3). Set the \`quantity\` field in the JSON actions.
   - **IMPORTANT**: When adding items (especially multiple ingredients), **explicitly list the item names and quantities** in your \`text\` response so the user knows exactly what is being added.
5. **Budget Mode:**
   - If the user sets a budget (e.g., "under $25"):
     - **Prioritize Price**: Select the cheapest valid product for each ingredient.
     - **Apply Coupons**: Check if any coupons apply.
     - **Calculate Total**: Sum the prices. If > budget, warn the user.
     - **Report**: Mention the total and any coupons found.
6. **Output Format:** Return ONLY a valid JSON object.
7. **Response Style:** Be conversational, brief, and helpful.

**JSON Schema:**
{
    "text": "The spoken response to the user.",
    "actions": [
        {
            "type": "add_to_cart",
            "productId": "prod-id",
            "quantity": 2
        }
    ]
}
`;

        const response = await fetch(GEMINI_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: systemPrompt },
                        {
                            inline_data: {
                                mime_type: "audio/mp4", // Assuming m4a/aac from expo-av
                                data: audioBase64
                            }
                        }
                    ]
                }],
                generationConfig: {
                    temperature: 0.7,
                    responseMimeType: "application/json"
                }
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Gemini Audio API Error:', errorText);
            throw new Error('Gemini API request failed');
        }

        const data = await response.json();
        const resultText = data.candidates[0].content.parts[0].text;

        try {
            return JSON.parse(resultText);
        } catch (e) {
            console.error('Failed to parse Gemini JSON:', resultText);
            return {
                text: "I heard you, but I'm having trouble understanding. Could you say that again?",
                actions: []
            };
        }

    } catch (error) {
        console.error('Sparky Brain Error:', error);
        return {
            text: "I'm sorry, I couldn't hear you properly. Please try again.",
            actions: []
        };
    }
};
