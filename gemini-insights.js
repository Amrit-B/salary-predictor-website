/**
 * Fetches career insights from the Gemini API based on user's experience and salary.
 * @param {number} experience - The user's years of professional experience.
 * @param {string} formattedSalary - The user's predicted salary, formatted as a string.
 * @returns {Promise<string>} A promise that resolves to the career insights text.
 * @throws {Error} If the API call fails or returns no content.
 */
export async function fetchCareerInsights(experience, formattedSalary) {
    // Construct the prompt for the Gemini API
    const prompt = `You are a helpful and encouraging career advisor. A person with ${experience} years of professional experience has a predicted salary of ${formattedSalary}. Based on this, provide some brief career insights. Include the following sections with markdown formatting:
    
1.  **Possible Job Titles:** Suggest 2-3 typical job titles for this experience level.
2.  **Key Skills to Develop:** List 2-3 important skills they should focus on for career growth.
3.  **Potential Next Steps:** Suggest one or two potential next steps in their career path.

Keep the tone positive and the response concise.`;

    // Call the Gemini API
    const apiKey = ""; // API key will be injected by the environment
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    
    const payload = {
        contents: [{
            role: "user",
            parts: [{ text: prompt }]
        }]
    };

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }

    const result = await response.json();

    if (result.candidates && result.candidates.length > 0 && result.candidates[0].content.parts[0].text) {
        return result.candidates[0].content.parts[0].text;
    } else {
        throw new Error("No content received from API.");
    }
}
