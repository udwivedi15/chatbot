class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse(message) {
    try {
      console.log("MessageParser received message:", message); // Add log to confirm message receipt
      const lowerCaseMessage = message.toLowerCase().trim();
      if (!lowerCaseMessage) {
        console.log("Empty message detected, calling handleEmptyMessage");
        this.actionProvider.handleEmptyMessage();
        return;
      }

      // Show typing indicator immediately
      this.actionProvider.showTypingIndicator();

      // Call GPT-based backend directly
      console.log("Passing message to ActionProvider:", lowerCaseMessage);
      this.actionProvider.handleMessage(lowerCaseMessage);
    } catch (error) {
      console.error("Error parsing message:", error);
      this.actionProvider.handleError();
    }
  }
}

export default MessageParser;