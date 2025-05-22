import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

function init() {
  const container = document.getElementById('chat-content');
  const chatContainer = document.getElementById('chat-container');

  if (container && chatContainer) {
    const root = ReactDOM.createRoot(container);
    root.render(<App />);
    
    // Show the chat-container after the app is mounted
    setTimeout(() => {
      chatContainer.style.display = 'block';
    }, 0);
  }
}

// Export globally for your HTML
window.ChatWidgetModule = { init };