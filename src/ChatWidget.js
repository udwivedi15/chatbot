// ChatWidget.jsx
import React, { useEffect, useState, useRef } from "react";
import Chatbot from "react-chatbot-kit";
import "react-chatbot-kit/build/main.css";
import config from "./config";
import MessageParser from "./MessageParser";
import ActionProvider from "./ActionProvider";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
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
  }, [darkMode]);

  const toggleChat = () => setIsOpen(!isOpen);
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
  };
  const clearChat = () => {
    localStorage.removeItem("chatHistory");
    window.location.reload();
  };

  return (
    <div style={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}>
      <button onClick={toggleChat} className="chat-toggle-button">
        {isOpen ? "Close Chat" : "Open Chat"}
      </button>

      {isOpen && (
        <div className="chat-widget" style={{
          width: 350,
          height: 500,
          border: "1px solid #ccc",
          borderRadius: 10,
          backgroundColor: "white",
          boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
          overflow: "hidden"
        }}>
          <div className="chat-header" style={{ padding: 10, background: "#f4f4f4", display: "flex", justifyContent: "space-between" }}>
            <span>Chatbot</span>
            <div>
              <button onClick={toggleDarkMode}>🌓</button>
              <button onClick={clearChat}>🗑️</button>
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
            placeholderText="Type your message..."
          />
        </div>
      )}
    </div>
  );
}
