import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate post content based on title
 * @param {string} title - The post title
 * @param {string} style - Content style (optional)
 * @returns {Promise<string>} Generated content
 */
export const generatePostContent = async (title, style = 'informative') => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Write an engaging and informative post content for the title: "${title}"

Style: ${style}

Requirements:
- Write 200-500 words
- Make it engaging and informative
- Use proper formatting with paragraphs
- Include relevant details and insights
- Make it suitable for a social media platform
- Use a conversational but professional tone
- Include actionable insights or takeaways

Content:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const generatedContent = response.text();
    
    if (!generatedContent) {
      throw new Error('Failed to generate content');
    }

    return generatedContent.trim();
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error(`Content generation failed: ${error.message}`);
  }
};

/**
 * Generate multiple content suggestions
 * @param {string} title - The post title
 * @returns {Promise<Array>} Array of content suggestions
 */
export const generateContentSuggestions = async (title) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured');
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `Generate 3 different content suggestions for the post title: "${title}"

Provide 3 different styles:
1. Informative/Educational
2. Conversational/Personal
3. Professional/Technical

Each should be 150-300 words and suitable for social media.

Format as JSON array with objects containing:
- style: string
- content: string

Example:
[
  {
    "style": "Informative",
    "content": "Your generated content here..."
  }
]`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const responseText = response.text();
    
    if (!responseText) {
      throw new Error('Failed to generate suggestions');
    }

    // Parse JSON response
    const suggestions = JSON.parse(responseText);
    
    if (!Array.isArray(suggestions) || suggestions.length === 0) {
      throw new Error('Invalid response format');
    }

    return suggestions;
  } catch (error) {
    console.error('Gemini Suggestions Error:', error);
    throw new Error(`Content suggestions failed: ${error.message}`);
  }
};
