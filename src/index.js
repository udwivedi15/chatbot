import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App'; // Importing the default export

let root = null;

function init(options = {}) {
  const containerId = options.elementId || 'chat-content';
  const wrapperId = options.wrapperId || 'chat-container';

  const container = document.getElementById(containerId);
  const wrapper = document.getElementById(wrapperId);

  if (!container) {
    console.error(`ChatWidgetModule: container element '${containerId}' not found.`);
    return;
  }

  try {
    if (!root) {
      root = createRoot(container);
      root.render(<App />); // Using the imported App component
    }

    if (wrapper) {
      setTimeout(() => {
        wrapper.style.display = 'block';
      }, 0);
    }
  } catch (err) {
    console.error('ChatWidgetModule: failed to initialize:', err);
  }
}

if (typeof window !== 'undefined') {
  window.ChatWidgetModule = { init };
}

export { init };