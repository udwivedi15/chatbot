class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse(message) {
    try {
      console.log("MessageParser received message:", message);

      const trimmedMessage = message?.toLowerCase().trim();

      if (!trimmedMessage) {
        console.warn("Empty message detected. Triggering empty message handler.");
        this.actionProvider.handleEmptyMessage();
        return;
      }

      console.log("Sending to ActionProvider:", trimmedMessage);
      this.actionProvider.handleMessage(trimmedMessage);
    } catch (error) {
      console.error("Error in MessageParser.parse:", error);
      this.actionProvider.handleError();
    }
  }
}

export default MessageParser;