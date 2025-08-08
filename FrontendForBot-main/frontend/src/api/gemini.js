export const generateGeminiResponse = async (prompt, history = []) => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;  // Canvas provides the key
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const chatHistory = [
    ...history,
    { role: "user", parts: [{ text: prompt }] }
  ];

  const payload = { contents: chatHistory };

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error(`API request failed with status ${response.status}`);

    const result = await response.json();

    if (result.candidates?.[0]?.content?.parts?.[0]) {
      return result.candidates[0].content.parts[0].text;
    } else {
      throw new Error("No valid content found in the API response.");
    }
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw error;
  }
};