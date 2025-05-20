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

      // Show typing indicator before processing the message
      this.actionProvider.showTypingIndicator()

      // Process the message with a slight delay to show the typing animation
      setTimeout(() => {
        this.actionProvider.handleMessage(lowerCaseMessage)
      }, 1500) // 1.5 seconds delay for typing animation
    } catch (error) {
      console.error("Error parsing message:", error)
      this.actionProvider.handleError()
    }
  }
}

export default MessageParser
