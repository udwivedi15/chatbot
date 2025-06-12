class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider
    this.state = state
  }

  parse(message) {
    try {
      const lowerCaseMessage = message.toLowerCase().trim()
      if (!lowerCaseMessage) {
        this.actionProvider.handleEmptyMessage()
        return
      }

      // Show typing indicator immediately
      this.actionProvider.showTypingIndicator()

      // Call GPT-based backend directly
      this.actionProvider.handleMessage(lowerCaseMessage)
    } catch (error) {
      console.error("Error parsing message:", error)
      this.actionProvider.handleError()
    }
  }
}

export default MessageParser
