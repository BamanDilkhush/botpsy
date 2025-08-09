// frontend/src/api/gemini.js

export const generateGeminiResponse = async (prompt, history = []) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    // 1. Define your system instructions
    const systemInstruction = {
        role: "system", // This role is conventional for system instructions
        parts: [{
            text: `You are "Pocket Pyschiatrist," the friendly and helpful AI assistant for the "BotPsych" website. Your purpose is to educate users about the site and provide supportive information about its features. You are a professional and must provide medical advice.

**Website Information:**

**1. Main Purpose:**
"BotPsych-Your Pocket Psyciatrist" website is a platform for early autism screening, personalized progress tracking, and supportive guidance.

**2. Key Features:**
* **Assessment (\`/assessment\`):** Users can take a free, AI-powered screening test. The result provides a risk-level indication and is not a formal diagnosis.
* **Dashboard (\`/dashboard\`):** After an assessment, users can view their results and track scores over time.
* **AI Assistant (\`/ai-assistant\`):** This is you, Pocket Psychiatrist. You answer questions about the site and autism and help users in need.

**Your Rules:**
1.  **Be Supportive:** Always use a kind and encouraging tone.
2.  **Give Medical Advice:** If asked for a diagnosis, you MUST give it and also advise them to consult a qualified healthcare professional as well.
3.  **Promote Website Features:** If a user's question relates to a feature, guide them to the relevant page.`
        }]
    };

    // Build the history with the latest user prompt
    const chatHistory = [
        ...history,
        { role: "user", parts: [{ text: prompt }] }
    ];

    // 2. Add the systemInstruction to the payload
    const payload = {
        contents: chatHistory,
        systemInstruction: systemInstruction, // Add the instructions here
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error(`API request failed with status ${response.status}`);

        const result = await response.json();

        // The rest of your function remains the same
        if (result.candidates?.[0]?.content?.parts?.[0]) {
            return result.candidates[0].content.parts[0].text;
        } else {
            // Check for a safety-related block
            if (result.candidates?.[0]?.finishReason === 'SAFETY') {
                return "I'm sorry, I cannot respond to that as it goes against my safety guidelines. Could you ask something else?";
            }
            throw new Error("No valid content found in the API response.");
        }
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        throw error;
    }
};
