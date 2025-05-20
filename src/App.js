"use client";

import { useEffect, useState, useRef } from "react";
import "./App.css";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import config from "./config";
import MessageParser from "./MessageParser";
import ActionProvider from "./ActionProvider";

function App() {
  const [isMaximized, setIsMaximized] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const formRef = useRef(null);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }

    const savedMessages = localStorage.getItem("chatHistory");
    if (savedMessages) {
      config.initialMessages = JSON.parse(savedMessages);
    }

    const savedDarkMode = localStorage.getItem("darkMode");
    if (savedDarkMode === "true") {
      setDarkMode(true);
    }

    // Event listener for custom send button if needed
    const form = formRef.current;
    if (form) {
      const customSendButton = form.querySelector(
        ".react-chatbot-kit-chat-input-form::after"
      );
      if (customSendButton) {
        form.addEventListener("submit", (e) => {
          e.preventDefault();
          const input = form.querySelector(".react-chatbot-kit-chat-input");
          if (input.value.trim()) {
            form.dispatchEvent(new Event("submit", { cancelable: true }));
          }
        });
      }
    }
  }, [darkMode]);

  const formattedDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  const toggleMaximize = () => setIsMaximized(!isMaximized);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", !darkMode);
  };

  const clearChat = () => {
    localStorage.removeItem("chatHistory");
    window.location.reload();
  };

  return (
    <div className={`App ${darkMode ? "dark-mode" : ""}`}>
      <div className="chatbot-wrapper">
        <button onClick={toggleMaximize} className="maximize-button">
          {isMaximized ? "Minimize" : "Maximize"}
        </button>
        <div className={`chatbot-container ${isMaximized ? "maximized" : ""}`}>
          <div className="chat-header">
            <div>Conversation with Bot</div>
            <div className="date-display">{formattedDate}</div>
            <div className="header-buttons">
              <button
                onClick={toggleDarkMode}
                className="dark-mode-toggle"
                aria-label="Toggle dark mode"
              >
                {darkMode ? (
                  // Sun icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="5"></circle>
                    <line x1="12" y1="1" x2="12" y2="3"></line>
                    <line x1="12" y1="21" x2="12" y2="23"></line>
                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                    <line x1="1" y1="12" x2="3" y2="12"></line>
                    <line x1="21" y1="12" x2="23" y2="12"></line>
                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                  </svg>
                ) : (
                  // Moon icon
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                )}
              </button>
              <button
                onClick={clearChat}
                className="clear-chat-button"
                aria-label="Clear chat"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18"></path>
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>

          <Chatbot
            config={config}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
            saveMessages={(messages) =>
              localStorage.setItem("chatHistory", JSON.stringify(messages))
            }
            ref={formRef}
            placeholderText="Type your message here..."
          />
        </div>
      </div>
    </div>
  );
}

export default App;
