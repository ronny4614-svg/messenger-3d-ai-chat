// AI Integration with OpenAI GPT
let apiKey = localStorage.getItem('openai_api_key') || '';

// Configure API key
function configureAI(key) {
    apiKey = key;
    localStorage.setItem('openai_api_key', key);
    console.log('✅ OpenAI API Key configured');
}

// Get API key from user
function promptForAPIKey() {
    const key = prompt('Enter your OpenAI API Key:');
    if (key) {
        configureAI(key);
        return true;
    }
    return false;
}

// Get AI response using OpenAI API
async function getAIResponse(userMessage) {
    // If no API key, use fallback responses
    if (!apiKey) {
        return getFallbackResponse(userMessage);
    }
    
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a helpful AI assistant in a 3D messenger chat application. Keep responses concise and friendly.'
                    },
                    {
                        role: 'user',
                        content: userMessage
                    }
                ],
                temperature: 0.7,
                max_tokens: 150
            })
        });
        
        if (!response.ok) {
            console.error('OpenAI API Error:', response.status);
            return getFallbackResponse(userMessage);
        }
        
        const data = await response.json();
        return data.choices[0].message.content.trim();
    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        return getFallbackResponse(userMessage);
    }
}

// Fallback responses when API key is not available
function getFallbackResponse(userMessage) {
    const lowerMessage = userMessage.toLowerCase();
    
    const responses = {
        greeting: [
            'Hello! How can I help you today?',
            'Hi there! What can I do for you?',
            'Hey! Great to chat with you!',
            'Welcome! How can I assist?'
        ],
        help: [
            'I can help you with questions, have conversations, and more. What do you need?',
            'I\'m here to help! Feel free to ask me anything.',
            'Need help? Ask me anything and I\'ll do my best to assist!'
        ],
        goodbye: [
            'Goodbye! Talk soon!',
            'See you later!',
            'Bye! Have a great day!',
            'Take care!'
        ],
        default: [
            'That\'s interesting! Tell me more.',
            'I see what you mean. Can you elaborate?',
            'That sounds great! What else?',
            'Interesting perspective! Any other thoughts?',
            'Got it! What would you like to know?',
            'I understand. How can I help further?'
        ]
    };
    
    // Check for greeting keywords
    if (/hello|hi|hey|greetings/.test(lowerMessage)) {
        return getRandomResponse(responses.greeting);
    }
    
    // Check for help keywords
    if (/help|assist|support/.test(lowerMessage)) {
        return getRandomResponse(responses.help);
    }
    
    // Check for goodbye keywords
    if (/bye|goodbye|farewell|see you|take care/.test(lowerMessage)) {
        return getRandomResponse(responses.goodbye);
    }
    
    // Check for specific questions
    if (/how are you|what's up|how do you feel/.test(lowerMessage)) {
        const replies = [
            'I\'m doing great, thanks for asking! How are you?',
            'I\'m here and ready to chat! How\'s your day going?',
            'Feeling good! What\'s on your mind?'
        ];
        return getRandomResponse(replies);
    }
    
    if (/what is|what are|who is|when is|where is|why is/.test(lowerMessage)) {
        const replies = [
            'That\'s a great question! I\'d love to help with more information from a proper API.',
            'Interesting question! For the best answer, please add your OpenAI API key.',
            'I can provide better answers when connected to OpenAI\'s GPT model.'
        ];
        return getRandomResponse(replies);
    }
    
    // Default response
    return getRandomResponse(responses.default);
}

// Get random response from array
function getRandomResponse(responses) {
    return responses[Math.floor(Math.random() * responses.length)];
}

// Display API key setup prompt on page load
document.addEventListener('DOMContentLoaded', () => {
    // Check if API key is already configured
    if (!apiKey) {
        console.log('💡 No OpenAI API key found. The chatbot will use fallback responses.');
        console.log('📝 To use GPT-3.5-turbo, run: configureAI("your-api-key")');
        
        // Optional: Ask user to configure API key
        setTimeout(() => {
            const shouldConfigure = confirm(
                'Would you like to add your OpenAI API Key now? (Optional - fallback responses available)\n\n' +
                'Click OK to enter your key, or Cancel to continue with demo mode.'
            );
            if (shouldConfigure) {
                promptForAPIKey();
            }
        }, 1000);
    }
});

// Utility function to validate API key format
function isValidAPIKey(key) {
    return key && key.startsWith('sk-') && key.length > 20;
}

// Get current API key status
function getAPIKeyStatus() {
    if (!apiKey) {
        return 'No API key configured. Using fallback responses.';
    }
    if (!isValidAPIKey(apiKey)) {
        return 'Invalid API key format. Please reconfigure.';
    }
    return 'API key configured and ready to use!';
}

// Clear API key
function clearAPIKey() {
    apiKey = '';
    localStorage.removeItem('openai_api_key');
    console.log('API Key cleared. Fallback responses enabled.');
}
