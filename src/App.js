import { useEffect, useState, useRef, useCallback } from "react";
import "./App.css";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import config from "./config";
import MessageParser from "./MessageParser";
import ActionProvider from "./ActionProvider";
import React from "react";

function App({ onReady }) {
  const [darkMode, setDarkMode] = useState(() => {
    const savedDarkMode = localStorage.getItem("darkMode");
    return savedDarkMode === "true";
  });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isClosed, setIsClosed] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [likedMessages, setLikedMessages] = useState({});
  const [dislikedMessages, setDislikedMessages] = useState({});
  const [copyStatus, setCopyStatus] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const [chatbotKey, setChatbotKey] = useState(Date.now());
  const [messages, setMessages] = useState([]); // Track messages to detect new ones
  const [hasScrolledUp, setHasScrolledUp] = useState(false); // Track if user has scrolled up
  const chatContainerRef = useRef(null);

  const handleCopy = async (messageId, message) => {
    console.log("handleCopy called for messageId:", messageId); // Debug log
    const text = typeof message === "string" ? message : message.toString();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        setCopyStatus({ [messageId]: "Copied!" }); // Clear other statuses, set only for this message
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
        setCopyStatus({ [messageId]: "Copied!" }); // Clear other statuses, set only for this message
      }
      setTimeout(() => {
        setCopyStatus((prev) => {
          console.log("Clearing copyStatus for messageId:", messageId); // Debug log
          return { ...prev, [messageId]: undefined }; // Clear only this message's status
        });
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text:", err.message);
      setCopyStatus({ [messageId]: "Failed to copy: Not supported" }); // Set error for this message only
      setTimeout(() => {
        setCopyStatus((prev) => {
          console.log("Clearing copyStatus for messageId:", messageId); // Debug log
          return { ...prev, [messageId]: undefined }; // Clear error status
        });
      }, 2000);
    }
  };

  const handleScroll = useCallback(() => {
    let timeout;
    return () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (chatContainerRef.current) {
          const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
          const isNotAtBottom = scrollHeight - scrollTop - clientHeight > 10;
          setShowScrollButton(isNotAtBottom);
          setHasScrolledUp(isNotAtBottom); // Update hasScrolledUp based on position
        }
      }, 100);
    };
  }, [setShowScrollButton, setHasScrolledUp]); // Include state setters as dependencies

  useEffect(() => {
    if (onReady) onReady();

    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }

    localStorage.setItem("darkMode", darkMode);

    const chatContainer = document.querySelector(".react-chatbot-kit-chat-message-container");
    if (chatContainer) {
      chatContainerRef.current = chatContainer;
      chatContainer.addEventListener("scroll", handleScroll());
      handleScroll()();
    }

    return () => {
      if (chatContainerRef.current) {
        chatContainerRef.current.removeEventListener("scroll", handleScroll());
      }
    };
  }, [darkMode, onReady, isClosed, handleScroll]);

  const handleLike = (messageId) => {
    setLikedMessages((prev) => ({ ...prev, [messageId]: !prev[messageId] }));
    if (dislikedMessages[messageId]) {
      setDislikedMessages((prev) => ({ ...prev, [messageId]: false }));
    }
  };

  const handleDislike = (messageId) => {
    setDislikedMessages((prev) => ({ ...prev, [messageId]: !prev[messageId] }));
    if (likedMessages[messageId]) {
      setLikedMessages((prev) => ({ ...prev, [messageId]: false }));
    }
  };

  const handleMinimize = () => {
    setTimeout(() => {
      setIsMinimized(true);
    }, 100);
  };

  const handleClose = () => {
    localStorage.removeItem("chatHistory");
    setLikedMessages({});
    setDislikedMessages({});
    setCopyStatus({});
    setChatbotKey(Date.now());
    setTimeout(() => {
      setIsClosed(true);
    }, 100);
  };

  const handleWidgetClick = () => {
    setIsMinimized(false);
    setIsClosed(false);
    setIsFullscreen(false);
    setChatbotKey(Date.now());
  };

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTo({
          top: chatContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
        setShowScrollButton(false);
        setHasScrolledUp(false); // Reset hasScrolledUp when manually scrolling to bottom
      }
    }, 100);
  };

  // Scroll to bottom when new messages are added, but only if the user hasn't scrolled up
  useEffect(() => {
    if (chatContainerRef.current && messages.length > 0 && !hasScrolledUp) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
      setShowScrollButton(false);
    }
  }, [messages, hasScrolledUp]);

  const formattedDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <>
      {!isClosed && !isMinimized && (
        <div className={`App ${darkMode ? "dark-mode" : ""} ${isFullscreen ? "fullscreen" : ""}`}>
          <div className="chatbot-wrapper">
            <div className="chatbot-container">
              <div className="chat-header">
                <div className="header-title">Chatbot</div>
                <div className="header-buttons">
                  <button onClick={toggleDarkMode} className="dark-mode-toggle" title={darkMode ? "Light Mode" : "Dark Mode"}>
                    {darkMode ? (
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
                  <button onClick={handleMinimize} className="fullscreen-toggle" title="Minimize">
                    –
                  </button>
                  <button
                    onClick={() => {
                      setIsFullscreen(!isFullscreen);
                      setIsMinimized(false);
                    }}
                    className="fullscreen-toggle"
                    title={isFullscreen ? "Restore" : "Maximize"}
                  >
                    ⤢
                  </button>
                  <button onClick={handleClose} className="fullscreen-toggle" title="Close">
                    ✕
                  </button>
                </div>
              </div>

              <Chatbot
                key={chatbotKey}
                config={{
                  ...config,
                  customComponents: {
                    ...config.customComponents,
                    header: () => (
                      <div
                        style={{
                          textAlign: "center",
                          padding: "10px",
                          color: darkMode ? "#fff" : "#666",
                          fontSize: "16px",
                          fontWeight: "normal",
                        }}
                      >
                        {formattedDate}
                      </div>
                    ),
                    botChatMessage: (props) => {
                      console.log("Rendering botChatMessage with props:", props); // Detailed debug log
                      console.log("props.id:", props.id, "copyStatus:", copyStatus, "copyStatus[props.id]:", copyStatus[props.id]); // Debug log
                      return (
                        <div className="bot-message-wrapper">
                          <config.customComponents.botChatMessage {...props} />
                          <div className="message-icons">
                            <button
                              onClick={() => handleLike(props.id)}
                              className={`icon-button like-button ${likedMessages[props.id] ? "liked" : ""}`}
                              type="button"
                              aria-label="Like"
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
                                <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDislike(props.id)}
                              className={`icon-button dislike-button ${dislikedMessages[props.id] ? "disliked" : ""}`}
                              type="button"
                              aria-label="Dislike"
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
                                <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7L2.34 13a2 2 0 0 0 2 2.3zM17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3" />
                              </svg>
                            </button>
                            <div style={{ display: "flex", alignItems: "center" }}>
                              <button
                                onClick={() => handleCopy(props.id, props.message)}
                                className="icon-button copy-button"
                                type="button"
                                aria-label="Copy"
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
                                  className="feather feather-copy"
                                >
                                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                </svg>
                              </button>
                              {copyStatus[props.id] && (
                                copyStatus[props.id] === "Copied!" ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="#28a745"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    style={{ marginLeft: "5px" }}
                                  >
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                ) : (
                                  <span
                                    style={{
                                      marginLeft: "5px",
                                      fontSize: "12px",
                                      color: "#dc3545",
                                    }}
                                  >
                                    {copyStatus[props.id]}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    },
                  },
                  state: { ...config.state, setIsTyping },
                }}
                messageParser={MessageParser}
                actionProvider={ActionProvider}
                saveMessages={(newMessages) => {
                  if (!isClosed) {
                    localStorage.setItem("chatHistory", JSON.stringify(newMessages));
                    setMessages(newMessages); // Update messages state to trigger scroll
                    setChatbotKey(Date.now()); // Force re-render to ensure unique message rendering
                  }
                }}
              />
              {isTyping && (
                <div className="typing-indicator-wrapper">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
              {showScrollButton && (
                <button
                  className={`scroll-to-bottom ${!showScrollButton ? "hidden" : ""}`}
                  onClick={scrollToBottom}
                >
                  ↓
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {(isClosed || isMinimized) && (
        <button className="floating-widget-button" onClick={handleWidgetClick}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#000000"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </button>
      )}
    </>
  );
}

export default App;