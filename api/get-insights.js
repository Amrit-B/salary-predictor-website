// This is our new Serverless Function. It runs on Vercel's servers, not in the browser.


export default async function handler(request, response) {
  // We only want to handle POST requests to this function.
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Get the 'experience' and 'salary' that the frontend sent in the request body.
    const { experience, salary } = request.body;

    // This is where we securely get our secret API key from Vercel's Environment Variables.
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return response.status(500).json({ message: 'API key is not configured.' });
    }

    let prompt;

    // Check if the experience level is beyond the human norm.
    if (experience > 50) {
      // If so, create a fun, creative prompt for an "immortal" being.
      prompt = `You are a witty and imaginative career advisor for mythical beings. A timeless, immortal entity with ${experience} years of "professional experience" has a predicted salary of ${salary}. They are clearly bored and looking for a new challenge. Provide some brief, humorous career insights. Include the following sections with markdown formatting:
    
1.  **Possible Job Titles:** Suggest 2-3 absurdly epic or funny job titles suitable for an immortal (e.g., "Galactic Historian," "Chief Time-Waster," "Professional Ghost").
2.  **Key Skills to Develop:** List 2-3 skills that would be useful or funny for someone who has seen it all (e.g., "Patience with Mortals," "Advanced Napping Techniques," "Forgetting Spoilers").
3.  **Potential Next Steps:** Suggest one or two hilarious next steps in their eternal career path.

Keep the tone lighthearted, funny, and epic.`;
    } else {
      // Otherwise, use the standard, helpful prompt.
      prompt = `You are a helpful and encouraging career advisor. A person with ${experience} years of professional experience has a predicted salary of ${salary}. Based on this, provide some brief career insights. Include the following sections with markdown formatting:
    
1.  **Possible Job Titles:** Suggest 2-3 typical job titles for this experience level.
2.  **Key Skills to Develop:** List 2-3 important skills they should focus on for career growth.
3.  **Potential Next Steps:** Suggest one or two potential next steps in their career path.

Keep the tone positive and the response concise.`;
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    
    const payload = {
      contents: [{
        role: "user",
        parts: [{ text: prompt }]
      }]
    };

    // Call the Gemini API from our secure serverless function.
    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      return response.status(geminiResponse.status).json({ message: `Gemini API error: ${errorText}` });
    }

    const result = await geminiResponse.json();
    const insightsText = result.candidates[0].content.parts[0].text;

    // Send the successful response back to our frontend website.
    return response.status(200).json({ insights: insightsText });

  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: 'An internal server error occurred.' });
  }
}
