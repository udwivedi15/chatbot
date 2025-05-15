// App.js
import React, { useEffect, useState, useRef } from 'react';
import './App.css';
import Chatbot from 'react-chatbot-kit';
import 'react-chatbot-kit/build/main.css';
import config from './config';
import MessageParser from './MessageParser';
import ActionProvider from './ActionProvider';

function App() {
  const [isMaximized, setIsMaximized] = useState(true);
  const formRef = useRef(null);

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatHistory');
    if (savedMessages) {
      config.initialMessages = JSON.parse(savedMessages);
    }

    // Add event listener to the custom send button
    const form = formRef.current;
    if (form) {
      const customSendButton = form.querySelector('.react-chatbot-kit-chat-input-form::after');
      if (customSendButton) {
        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const input = form.querySelector('.react-chatbot-kit-chat-input');
          if (input.value.trim()) {
            form.dispatchEvent(new Event('submit', { cancelable: true }));
          }
        });
      }
    }
  }, []);

  const toggleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const clearChat = () => {
    localStorage.removeItem('chatHistory');
    window.location.reload();
  };

  return (
    <div className="App">
      <div className="chatbot-wrapper">
        <button onClick={toggleMaximize} className="maximize-button">
          {isMaximized ? 'Minimize' : 'Maximize'}
        </button>
        <div className={`chatbot-container ${isMaximized ? 'maximized' : ''}`}>
          <button onClick={clearChat} className="clear-chat-button">🗑️ Clear Chat</button>
          <Chatbot
            config={config}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
            saveMessages={(messages) => localStorage.setItem('chatHistory', JSON.stringify(messages))}
            ref={formRef} // Attach ref to the Chatbot component
          />
        </div>
      </div>
    </div>
  );
}

export default App;