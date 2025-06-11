/* App.js */
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [likedMessages, setLikedMessages] = useState({});
  const [copiedMessages, setCopiedMessages] = useState({});
  const [copyStatus, setCopyStatus] = useState({}); // Track copy success/failure per message
  const formRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  const observerRef = useRef(null);
  const keydownHandlerRef = useRef(null);
  const dateObserverRef = useRef(null);

  useEffect(() => {
    if (onReady) onReady();

    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }

    const savedMessages = localStorage.getItem("chatHistory");
    if (savedMessages) {
      const parsedMessages = JSON.parse(savedMessages);
      const updatedMessages = parsedMessages.map((msg, index) => ({
        ...msg,
        id: msg.id || `restored_${Date.now()}_${index}`,
      }));
      config.initialMessages = updatedMessages;
    }

    const handleScroll = () => {
      if (chatContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
        setShowScrollButton(scrollHeight - scrollTop - clientHeight > 50);
      }
    };

    const injectDate = () => {
      const chatContainer = document.querySelector(".react-chatbot-kit-chat-message-container");
      if (chatContainer) {
        chatContainerRef.current = chatContainer;
        chatContainer.addEventListener("scroll", handleScroll);

        if (!chatContainer.querySelector(".date-display")) {
          const formattedDate = new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          });
          const dateDiv = document.createElement("div");
          dateDiv.className = "date-display";
          dateDiv.textContent = formattedDate;
          chatContainer.insertBefore(dateDiv, chatContainer.firstChild);
        }
      }
    };

    const observer = new MutationObserver((mutations, obs) => {
      const chatContainer = document.querySelector(".react-chatbot-kit-chat-message-container");
      if (chatContainer) {
        injectDate();
        obs.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
    dateObserverRef.current = observer;

    const chatContainerObserver = new MutationObserver(() => {
      const chatContainer = document.querySelector(".react-chatbot-kit-chat-message-container");
      if (chatContainer && !chatContainer.querySelector(".date-display")) {
        const formattedDate = new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        });
        const dateDiv = document.createElement("div");
        dateDiv.className = "date-display";
        dateDiv.textContent = formattedDate;
        chatContainer.insertBefore(dateDiv, chatContainer.firstChild);
      }
    });

    const chatInnerContainer = document.querySelector(".react-chatbot-kit-chat-inner-container");
    if (chatInnerContainer) {
      chatContainerObserver.observe(chatInnerContainer, { childList: true, subtree: true });
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
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            if (inputField.value.trim()) {
              sendButton.click();
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
      if (dateObserverRef.current) {
        dateObserverRef.current.disconnect();
      }
      chatContainerObserver.disconnect();
    };
  }, [darkMode, onReady]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("darkMode", !darkMode);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(true);
    setIsMaximized(false);
    setIsFullscreen(false);
  };

  const toggleMaximize = () => {
    setIsMaximized(true);
    setIsMinimized(false);
    setIsFullscreen(false);
  };

  const closeChat = () => {
    setIsMinimized(false);
    setIsMaximized(false);
    setIsFullscreen(false);
    document.querySelector(".App").style.display = "none";
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const handleLike = (messageId) => {
    console.log('Liking message with ID:', messageId);
    setLikedMessages((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }));
  };

  const handleCopy = async (messageId, text) => {
    console.log('Copy button clicked for message ID:', messageId, 'Text:', text);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        console.log('Successfully copied to clipboard');
        setCopiedMessages((prev) => ({
          ...prev,
          [messageId]: true,
        }));
        setCopyStatus((prev) => ({
          ...prev,
          [messageId]: 'Copied!',
        }));
      } else {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          console.log('Fallback: Successfully copied to clipboard');
          setCopiedMessages((prev) => ({
            ...prev,
            [messageId]: true,
          }));
          setCopyStatus((prev) => ({
            ...prev,
            [messageId]: 'Copied!',
          }));
        } catch (err) {
          console.error('Fallback: Failed to copy', err);
          setCopyStatus((prev) => ({
            ...prev,
            [messageId]: 'Failed to copy',
          }));
        }
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      setCopyStatus((prev) => ({
        ...prev,
        [messageId]: 'Failed to copy',
      }));
    }

    // Reset the status after 2 seconds
    setTimeout(() => {
      setCopiedMessages((prev) => ({
        ...prev,
        [messageId]: false,
      }));
      setCopyStatus((prev) => ({
        ...prev,
        [messageId]: undefined,
      }));
    }, 2000);
  };

  return (
    <div className={`App ${darkMode ? "dark-mode" : ""} ${isMaximized ? "" : isMinimized ? "minimized" : ""} ${isFullscreen ? "fullscreen" : ""}`}>
      <div className="chatbot-wrapper">
        <div className="chatbot-container">
          <div className="chat-header">
            <div className="header-title">Grok</div>
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
              <button
                onClick={toggleMinimize}
                className="minimize-button"
                aria-label="Minimize chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
              </button>
              <button
                onClick={toggleMaximize}
                className="maximize-button"
                aria-label="Maximize chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                </svg>
              </button>
              <button
                onClick={closeChat}
                className="close-button"
                aria-label="Close chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              <button
                onClick={toggleFullscreen}
                className="fullscreen-toggle"
                aria-label={isFullscreen ? "Exit full screen" : "Enter full screen"}
              >
                {isFullscreen ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3h6v6M9 3h12v12M21 9v12H9M3 15v6h12" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <Chatbot
            config={{
              ...config,
              customComponents: {
                ...config.customComponents,
                botChatMessage: (props) => {
                  console.log('botChatMessage props:', props);
                  return (
                    <config.customComponents.botChatMessage
                      {...props}
                      onLike={handleLike}
                      isLiked={likedMessages[props.id] || false}
                      onCopy={handleCopy}
                      isCopied={copiedMessages[props.id] || false}
                      copyStatus={copyStatus[props.id] || 'Copy'} // Pass copy status
                    />
                  );
                },
              },
            }}
            messageParser={MessageParser}
            actionProvider={ActionProvider}
            saveMessages={(messages) =>
              localStorage.setItem("chatHistory", JSON.stringify(messages))
            }
            ref={formRef}
            placeholderText="Type your message here..."
          />

          {showScrollButton && (isMaximized || isFullscreen) && (
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