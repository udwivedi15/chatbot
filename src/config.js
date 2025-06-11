import { createChatBotMessage } from 'react-chatbot-kit';
import React from 'react';
import './App.css';

// Custom Bot Message Component
const CustomBotMessage = (props) => {
  const now = new Date();
  const time = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  });

  const handleCopyClick = () => {
    props.onCopy?.(props.id, props.message);
  };

  const handleLikeClick = () => {
    props.onLike?.(props.id);
  };

  return (
    <div className="react-chatbot-kit-chat-bot-message">
      <div className="react-chatbot-kit-chat-bot-message-container">
        <span className="bot-text-wrapper">{props.message}</span>
        <span className="message-time-internal">{time}</span>

        <div className="message-options">
          <button
            className={`option-button like-button ${props.isLiked ? 'liked' : ''}`}
            onClick={handleLikeClick}
            title="Like"
          >
            👍
          </button>
          <button
            className={`option-button copy-button ${props.isCopied ? 'copied' : ''}`}
            onClick={handleCopyClick}
            title={props.isCopied ? "Copied!" : "Copy"}
          >
            📋
          </button>
        </div>
      </div>
      <div className="message-metadata">
        <span className="message-time">{time}</span>
      </div>
    </div>
  );
};

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

const createMessageWithId = (text, options = {}) => {
  return {
    ...createChatBotMessage(text, options),
    id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  };
};

const config = {
  initialMessages: [
    createMessageWithId("Hey! I'm here to help you.", { delay: 500 }),
  ],
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


