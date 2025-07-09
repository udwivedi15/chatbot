import { createChatBotMessage } from 'react-chatbot-kit';
import React from 'react';
import './App.css';

// Counter for generating unique message IDs
let messageIdCounter = 0;

// Custom Bot Message Component
const CustomBotMessage = (props) => {
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  return (
    <div className="react-chatbot-kit-chat-bot-message">
      <div className="react-chatbot-kit-chat-bot-message-container">
        <span className="bot-text-wrapper">{props.message}</span>
        <span className="message-time-internal">{time}</span>
        <div className="message-options"></div>
      </div>
      <div className="message-metadata">
        <span className="message-time">{time}</span>
      </div>
    </div>
  );
};

// Custom User Message Component
const CustomUserMessage = (props) => {
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  return (
    <div className="react-chatbot-kit-chat-user-message">
      <div className="react-chatbot-kit-chat-user-message-container">
        <span className="message-content">{props.message}</span>
        <span className="message-time-internal">{time}</span>
      </div>
      <div className="message-metadata">
        <span className="message-time">{time}</span>
      </div>
    </div>
  );
};

export const createMessageWithId = (text, options = {}) => {
  const message = createChatBotMessage(text, {
    ...options,
  });
  const uniqueId = `msg_${messageIdCounter++}`;
  console.log(`Generated message ID: ${uniqueId} for text: "${text}"`); // Debug log
  return {
    ...message,
    id: uniqueId,
  };
};

const botMessage = createMessageWithId("Hi! I can help you understand and explore the data. What would you like to know?", {
  delay: 500,
  withAvatar: false,
});

const config = {
  initialMessages: [
    botMessage,
  ],
  state: {
    setIsTyping: () => {}, // Placeholder, will be overridden in App.js
    messages: [], // Placeholder, will be overridden in App.js
  },
  customComponents: {
    botChatMessage: CustomBotMessage,
    userChatMessage: CustomUserMessage,
    minimizeButton: (props) => (
      <button {...props} className="minimize-button" title="Minimize">–</button>
    ),
    maximizeButton: (props) => (
      <button {...props} className="maximize-button" title="Maximize">⤢</button>
    ),
    closeButton: (props) => (
      <button {...props} className="close-button" title="Close">✕</button>
    ),
  },
};

export default config;