
// Function to get response from Gemini API
const GEMINI_API_KEY = "AIzaSyC2s1tUXi7vC-ed-isAuYgnrJk-Zg5238Y";
// API URL to use Gemini 2.0 Flash model
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-2.0-flash:generateContent";

export const getGeminiResponse = async (userContext: string, message: string): Promise<string> => {
  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are an AI career counselor providing guidance based on the user's interests and career goals.
                The user is interested in: ${userContext}.
                
                Please provide helpful, realistic career advice that can be implemented. Focus on specific career paths, 
                education requirements, skills needed, and potential opportunities.
                
                User question: ${message}`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    // Extract the response text from the Gemini API response
    if (data.candidates && data.candidates[0] && data.candidates[0].content && 
        data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Unexpected response format from Gemini API');
    }
  } catch (error) {
    console.error('Error getting Gemini response:', error);
    return "I'm sorry, I encountered an error while processing your request. Please try again.";
  }
};
