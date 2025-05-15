// In config.js
import { createChatBotMessage } from 'react-chatbot-kit';
import React from 'react';

// Fix the custom message components
const CustomBotMessage = (props) => {
  // Get current date and time
  const now = new Date();
  const date = now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const time = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  return (
    <div className="react-chatbot-kit-chat-bot-message">
      <div className="react-chatbot-kit-chat-bot-message-arrow"></div>
      <div className="react-chatbot-kit-chat-bot-message-container">
        <span>{props.message}</span>
      </div>
      <div className="message-metadata">
        <span className="message-date">{date}</span>
        <span className="message-time">{time}</span>
      </div>
    </div>
  );
};

const CustomUserMessage = (props) => {
  // Get current date and time
  const now = new Date();
  const date = now.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const time = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  return (
    <div className="react-chatbot-kit-chat-user-message">
      <div className="react-chatbot-kit-chat-user-message-container">
        <span>{props.message}</span>
      </div>
      <div className="message-metadata">
        <span className="message-date">{date}</span>
        <span className="message-time">{time}</span>
      </div>
    </div>
  );
};

// Update your config object
const config = {
  initialMessages: [
    createChatBotMessage("Hey! I'm here to help you."),
  ],
  customComponents: {
    // Fix the custom message components
    botChatMessage: CustomBotMessage,
    userChatMessage: CustomUserMessage,
  },
  
  // Keep any other existing config properties
};

export default config;