import App from "./App";

window.renderChatbot = (onReady) => {
  const root = ReactDOM.createRoot(document.getElementById("chat-content"));
  root.render(<App onReady={onReady} />);
};
