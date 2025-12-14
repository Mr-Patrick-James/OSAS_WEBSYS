# OSAS Chatbot Setup Guide

## Overview

The OSAS Chatbot is a hybrid system that combines rule-based responses with AI-powered fallback using OpenAI's GPT models. It provides intelligent assistance for the OSAS (Office of Student Affairs and Services) system.

## Features

- **Rule-based responses** for common queries (works without API key)
- **AI-powered responses** using OpenAI GPT-3.5-turbo (requires API key)
- **Real-time database integration** for statistics and data queries
- **Rate limiting** to prevent abuse
- **Message history** stored in browser localStorage
- **Responsive design** that works on all devices
- **Dark mode support** (follows system theme)

## Installation

The chatbot is already integrated into the dashboard. No additional installation steps are required.

## Configuration

### Basic Setup (Rule-based only)

The chatbot works out of the box with rule-based responses. No configuration needed!

### AI-Enhanced Setup (Optional)

To enable AI-powered responses:

1. **Get an OpenAI API Key**
   - Sign up at https://platform.openai.com/
   - Navigate to API Keys section
   - Create a new API key

2. **Configure the Chatbot**
   - Copy the example config file:
     ```bash
     cp config/chatbot_config.php.example config/chatbot_config.php
     ```
   
   - Edit `config/chatbot_config.php` and add your API key:
     ```php
     'openai_api_key' => 'sk-your-actual-api-key-here',
     ```

3. **Security Note**
   - **DO NOT** commit `chatbot_config.php` to version control
   - Add it to `.gitignore`:
     ```
     config/chatbot_config.php
     ```

### Alternative: Environment Variables

You can also set the API key via environment variable:

```bash
export OPENAI_API_KEY='sk-your-api-key-here'
```

## Usage

### User Interface

1. **Open Chatbot**: Click the chat icon in the bottom-right corner
2. **Send Messages**: Type your question and press Enter or click Send
3. **Quick Actions**: Use the quick action buttons for common queries
4. **Close Chatbot**: Click the X button in the header

### Example Queries

**Statistics:**
- "How many students are in the system?"
- "Show me violation statistics"
- "How many departments are there?"

**General Help:**
- "Help me with the OSAS system"
- "What can you do?"
- "Explain the system"

**Conversational:**
- "Hello"
- "Tell me about violations"
- "What is OSAS?"

## Customization

### Adding Custom Rules

Edit `api/chatbot.php` and add new patterns in the `getRuleBasedResponse()` function:

```php
// Example: Add a new rule
if (preg_match('/\b(your pattern here)\b/i', $message)) {
    return "Your custom response here";
}
```

### Styling

The chatbot styles are in `assets/styles/chatbot.css`. You can customize:
- Colors (uses CSS variables from Dashboard.css)
- Sizes and spacing
- Animations
- Responsive breakpoints

### AI Behavior

Modify the system prompt in `getAIResponse()` function in `api/chatbot.php` to change how the AI responds.

## Security Features

- **Input Sanitization**: All user inputs are sanitized
- **Rate Limiting**: 20 requests per 60 seconds per session
- **Message Length Limits**: Maximum 500 characters
- **CORS Protection**: Configured for your domain
- **Error Handling**: Graceful error messages without exposing internals

## Troubleshooting

### Chatbot Not Appearing

1. Check browser console for JavaScript errors
2. Verify `chatbot.css` and `chatbot.js` are loaded
3. Check file paths are correct

### AI Not Responding

1. Verify API key is set correctly in `chatbot_config.php`
2. Check API key is valid and has credits
3. Check server logs for errors
4. Verify internet connection (AI requires external API call)

### Database Statistics Not Showing

1. Verify database connection in `config/db_connect.php`
2. Check table names match your database schema
3. Ensure user has SELECT permissions

### Rate Limit Errors

- Wait 60 seconds before trying again
- Increase `rate_limit_max` in config if needed
- Clear session data if testing

## API Endpoints

### POST `/api/chatbot.php`

**Request:**
```json
{
  "message": "How many students are there?",
  "history": [
    {"role": "user", "content": "Hello"},
    {"role": "assistant", "content": "Hi! How can I help?"}
  ]
}
```

**Response:**
```json
{
  "success": true,
  "response": "There are currently 150 students in the OSAS system."
}
```

## File Structure

```
OSAS_WEBSYS/
├── api/
│   └── chatbot.php              # Main API endpoint
├── assets/
│   ├── components/
│   │   └── chatbot.html         # HTML structure (optional, created inline)
│   ├── js/
│   │   └── chatbot.js           # Frontend JavaScript
│   └── styles/
│       └── chatbot.css          # Chatbot styles
├── config/
│   ├── chatbot_config.php       # Your config (not in repo)
│   └── chatbot_config.php.example # Example config
└── CHATBOT_SETUP.md            # This file
```

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console and server logs
3. Verify all files are in place and paths are correct

## License

Part of the OSAS Web System project.
