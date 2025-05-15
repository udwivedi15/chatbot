import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'react-chatbot-kit/build/main.css';

class MyChatbot extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    const mountPoint = document.createElement('div');
    shadow.appendChild(mountPoint);
    const style = document.createElement('style');
    style.textContent = `
      :host {
        display: block;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
          'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      }
      .App {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background-color: #f0f2f5;
      }
      .chatbot-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 450px;
        height: 600px;
        background-color: #ffffff;
        border-radius: 15px;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        display: flex;
        flex-direction: column;
        overflow: hidden;
        z-index: 1000;
      }
      .chat-window {
        flex: 1;
        padding: 20px;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
        gap: 15px;
        background: linear-gradient(180deg, #f9f9f9, #ffffff);
      }
      .chat-message {
        max-width: 80%;
        padding: 15px 20px;
        border-radius: 20px;
        font-size: 16px;
        line-height: 1.6;
        word-wrap: break-word;
      }
      .chat-message.user {
        background-color: #1e90ff;
        color: white;
        align-self: flex-end;
        border-bottom-left-radius: 4px;
      }
      .chat-message.bot {
        background-color: #e8ecef;
        color: #2d3436;
        align-self: flex-start;
        border-bottom-right-radius: 4px;
      }
      .typing {
        display: flex;
        gap: 6px;
        padding: 10px;
      }
      .typing span {
        background-color: #b2bec3;
        border-radius: 50%;
        width: 12px;
        height: 12px;
        animation: typing-animation 1.2s infinite ease-in-out;
      }
      .typing span:nth-child(1) { animation-delay: 0s; }
      .typing span:nth-child(2) { animation-delay: 0.2s; }
      .typing span:nth-child(3) { animation-delay: 0.4s; }
      @keyframes typing-animation {
        0%, 100% { transform: translateY(0); opacity: 0.4; }
        50% { transform: translateY(-5px); opacity: 1; }
      }
      .input-area {
        display: flex;
        align-items: center;
        padding: 15px;
        background-color: #f1f3f5;
        border-top: 1px solid #dee2e6;
      }
      .input-area input {
        flex: 1;
        padding: 15px 20px;
        border: 1px solid #ced4da;
        border-radius: 25px;
        outline: none;
        font-size: 16px;
        transition: border-color 0.3s, box-shadow 0.3s;
      }
      .input-area input:focus {
        border-color: #1e90ff;
        box-shadow: 0 0 0 3px rgba(30, 144, 255, 0.1);
      }
      .input-area button {
        background-color: #1e90ff;
        color: white;
        border: none;
        padding: 15px 25px;
        border-radius: 25px;
        cursor: pointer;
        font-size: 16px;
        margin-left: 10px;
        transition: background-color 0.3s, transform 0.2s;
      }
      .input-area button:hover {
        background-color: #0984e3;
        transform: translateY(-1px);
      }
      .input-area button:active {
        transform: translateY(0);
      }
      @media (max-width: 600px) {
        .chatbot-container {
          width: 95%;
          height: 85vh;
          bottom: 10px;
          right: 10px;
          left: 10px;
          margin: auto;
        }
        .chat-window {
          padding: 15px;
        }
        .chat-message {
          font-size: 15px;
          padding: 12px 16px;
        }
        .input-area input {
          font-size: 15px;
          padding: 12px 16px;
        }
        .input-area button {
          padding: 12px 20px;
          font-size: 15px;
        }
      }
      /* Ensure react-chatbot-kit styles */
      .react-chatbot-kit-chat-container {
        width: 100%;
        height: 100%;
      }
      .react-chatbot-kit-chat-inner-container {
        height: 100%;
        border-radius: 15px;
        overflow: hidden;
      }
      .react-chatbot-kit-chat-header {
        display: none; /* Hide header as in npm start */
      }
      .react-chatbot-kit-chat-message-container {
        height: 100%;
        display: flex;
        flex-direction: column;
      }
      .react-chatbot-kit-chat-input-container {
        width: 100%;
        display: flex;
        align-items: center;
        padding: 15px;
        background-color: #f1f3f5;
        border-top: 1px solid #dee2e6;
      }
      .react-chatbot-kit-chat-input {
        flex: 1;
        padding: 15px 20px;
        border: 1px solid #ced4da;
        border-radius: 25px;
        outline: none;
        font-size: 16px;
      }
      .react-chatbot-kit-chat-btn-send {
        background-color: #1e90ff;
        color: white;
        border: none;
        padding: 15px 25px;
        border-radius: 25px;
        cursor: pointer;
        font-size: 16px;
        margin-left: 10px;
      }
    `;
    shadow.appendChild(style);
    const root = ReactDOM.createRoot(mountPoint);
    root.render(<App />);
  }
}
if (!customElements.get('my-chatbot')) {
  customElements.define('my-chatbot', MyChatbot);
}