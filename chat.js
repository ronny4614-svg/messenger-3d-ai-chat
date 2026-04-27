// Chat functionality
const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');

// Chat history
let chatHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];

// Load chat history on page load
function loadChatHistory() {
    chatHistory.forEach(msg => {
        displayMessage(msg.text, msg.sender);
    });
    scrollToBottom();
}

// Display message in chat
function displayMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.textContent = text;
    
    messageDiv.appendChild(contentDiv);
    chatBox.appendChild(messageDiv);
    
    // Save to history
    if (sender === 'user' || sender === 'ai') {
        chatHistory.push({ text, sender, timestamp: new Date().toISOString() });
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }
    
    scrollToBottom();
}

// Show typing indicator
function showTypingIndicator() {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ai';
    messageDiv.id = 'typing-indicator';
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    for (let i = 0; i < 3; i++) {
        const dot = document.createElement('div');
        dot.className = 'typing-dot';
        contentDiv.appendChild(dot);
    }
    
    messageDiv.appendChild(contentDiv);
    chatBox.appendChild(messageDiv);
    scrollToBottom();
}

// Remove typing indicator
function removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) {
        indicator.remove();
    }
}

// Scroll to bottom of chat
function scrollToBottom() {
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Send message event listener
sendBtn.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Send message function
async function sendMessage() {
    const message = messageInput.value.trim();
    
    if (!message) return;
    
    // Display user message
    displayMessage(message, 'user');
    messageInput.value = '';
    messageInput.focus();
    
    // Show typing indicator
    showTypingIndicator();
    
    // Get AI response
    try {
        const response = await getAIResponse(message);
        removeTypingIndicator();
        displayMessage(response, 'ai');
    } catch (error) {
        console.error('Error getting AI response:', error);
        removeTypingIndicator();
        displayMessage('Sorry, I encountered an error. Please try again.', 'ai');
    }
}

// Clear chat history
function clearChatHistory() {
    chatHistory = [];
    localStorage.removeItem('chatHistory');
    chatBox.innerHTML = '';
    console.log('Chat history cleared');
}

// Export chat history as JSON
function exportChatHistory() {
    const dataStr = JSON.stringify(chatHistory, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `chat-history-${new Date().getTime()}.json`;
    link.click();
}

// Load chat history when page loads
document.addEventListener('DOMContentLoaded', loadChatHistory);
