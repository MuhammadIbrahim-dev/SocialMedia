import { generatePostContent, generateContentSuggestions } from '../services/geminiService.js';

/**
 * Generate post content based on title
 */
export const generateContent = async (req, res) => {
  try {
    const { title, style } = req.body;

    // Validation
    if (!title || title.trim().length === 0) {
      return res.status(400).json({ 
        message: 'Title is required' 
      });
    }

    if (title.trim().length < 3) {
      return res.status(400).json({ 
        message: 'Title must be at least 3 characters long' 
      });
    }

    if (title.trim().length > 200) {
      return res.status(400).json({ 
        message: 'Title must be less than 200 characters' 
      });
    }

    // Generate content
    const content = await generatePostContent(title.trim(), style || 'informative');

    res.json({
      success: true,
      title: title.trim(),
      content: content,
      style: style || 'informative'
    });

  } catch (error) {
    console.error('Content generation error:', error);
    
    if (error.message.includes('API key')) {
      return res.status(500).json({ 
        message: 'Gemini AI service is not configured. Please add GEMINI_API_KEY to your environment variables.' 
      });
    }

    res.status(500).json({ 
      message: error.message || 'Failed to generate content' 
    });
  }
};

/**
 * Generate multiple content suggestions
 */
export const generateSuggestions = async (req, res) => {
  try {
    const { title } = req.body;

    // Validation
    if (!title || title.trim().length === 0) {
      return res.status(400).json({ 
        message: 'Title is required' 
      });
    }

    if (title.trim().length < 3) {
      return res.status(400).json({ 
        message: 'Title must be at least 3 characters long' 
      });
    }

    if (title.trim().length > 200) {
      return res.status(400).json({ 
        message: 'Title must be less than 200 characters' 
      });
    }

    // Generate suggestions
    const suggestions = await generateContentSuggestions(title.trim());

    res.json({
      success: true,
      title: title.trim(),
      suggestions: suggestions
    });

  } catch (error) {
    console.error('Content suggestions error:', error);
    
    if (error.message.includes('API key')) {
      return res.status(500).json({ 
        message: 'Gemini AI service is not configured. Please add GEMINI_API_KEY to your environment variables.' 
      });
    }

    res.status(500).json({ 
      message: error.message || 'Failed to generate suggestions' 
    });
  }
};
