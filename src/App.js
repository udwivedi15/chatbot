"use client";

import { useEffect, useState, useRef } from "react";
import "./App.css";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import config from "./config";
import MessageParser from "./MessageParser";
import ActionProvider from "./ActionProvider";

function App({ onReady }) {
  const [darkMode, setDarkMode] = useState(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    return savedDarkMode === "true";
  });
  const [isMaximized, setIsMaximized] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const formRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const observerRef = useRef(null);
  const keydownHandlerRef = useRef(null);

  useEffect(() => {
    if (onReady) onReady(); // ✅ Notify parent that chatbot has rendered

    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }

    const savedMessages = localStorage.getItem("chatHistory");
    if (savedMessages) {
      config.initialMessages = [...JSON.parse(savedMessages)];
    }

    const handleScroll = () => {
      if (chatContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
        setShowScrollButton(scrollHeight - scrollTop - clientHeight > 50);
      }
    };

    const chatContainer = document.querySelector(".react-chatbot-kit-chat-message-container");
    if (chatContainer) {
      chatContainerRef.current = chatContainer;
      chatContainer.addEventListener("scroll", handleScroll);
    }

    const attachKeydownListener = () => {
      const inputField = document.querySelector(".react-chatbot-kit-chat-input");
      const sendButton = document.querySelector(".react-chatbot-kit-chat-btn-send");

      if (inputField && sendButton) {
        inputRef.current = inputField;

        if (keydownHandlerRef.current) {
          inputField.removeEventListener("keydown", keydownHandlerRef.current);
        }

        const handler = (event) => {
          if (event.key === "Enter") {
            if (!event.shiftKey) {
              event.preventDefault();
              if (inputField.value.trim()) {
                sendButton.click();
              }
            }
          }
        };

        keydownHandlerRef.current = handler;
        inputField.addEventListener("keydown", handler);
      }
    };

    const timer = setTimeout(() => {
      attachKeydownListener();
    }, 500);

    const formContainer = document.querySelector(".react-chatbot-kit-chat-input-container");
    if (formContainer) {
      observerRef.current = new MutationObserver(() => {
        const inputField = document.querySelector(".react-chatbot-kit-chat-input");
        if (inputField && inputField !== inputRef.current) {
          attachKeydownListener();
        }
      });
      observerRef.current.observe(formContainer, { childList: true, subtree: true });
    }

    const form = formRef.current?.querySelector(".react-chatbot-kit-chat-input-form");
    if (form) {
      form.addEventListener("submit", (event) => {
        const input = form.querySelector(".react-chatbot-kit-chat-input");
        if (!input.value.trim()) {
          event.preventDefault();
        }
      });
    }

    return () => {
      clearTimeout(timer);
      if (chatContainerRef.current) {
        chatContainerRef.current.removeEventListener("scroll", handleScroll);
      }
      if (inputRef.current && keydownHandlerRef.current) {
        inputRef.current.removeEventListener("keydown", keydownHandlerRef.current);
      }
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [darkMode, onReady]);

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

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                  </svg>
                )}
              </button>
              <button onClick={clearChat} className="clear-chat-button" aria-label="Clear chat">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

          {showScrollButton && (
            <button
              onClick={scrollToBottom}
              className="scroll-to-bottom"
              aria-label="Scroll to bottom"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14"></path>
                <path d="M5 12l7 7 7-7"></path>
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
