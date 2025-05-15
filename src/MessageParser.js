class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider
  }

  parse(message) {
    try {
      const lowerCaseMessage = message.toLowerCase().trim()
      if (!lowerCaseMessage) {
        this.actionProvider.handleEmptyMessage()
        return
      }
      this.actionProvider.handleMessage(lowerCaseMessage)
    } catch (error) {
      console.error("Error parsing message:", error)
      this.actionProvider.handleError()
    }
  }
}

export default MessageParser
