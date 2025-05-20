import dataset from "./dataset"

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc, createClientMessage) {
    this.createChatBotMessage = createChatBotMessage
    this.setState = setStateFunc
    this.createClientMessage = createClientMessage
    this.dataset = dataset
  }

  // Show typing indicator
  showTypingIndicator = () => {
    this.setState((prevState) => ({
      ...prevState,
      isTyping: true,
    }))
  }

  // Hide typing indicator
  hideTypingIndicator = () => {
    this.setState((prevState) => ({
      ...prevState,
      isTyping: false,
    }))
  }

  handleMessage(message) {
    // Find a matching response from the dataset
    const matchedItem = this.dataset.find((item) => item.question.toLowerCase().includes(message))

    const response = matchedItem
      ? matchedItem.answer
      : "Sorry, I didn't understand that. Try something like 'Tell me a joke' or 'What's your name?'"

    // Hide typing indicator and show the response
    this.hideTypingIndicator()

    const botMessage = this.createChatBotMessage(response)
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }))
  }

  handleEmptyMessage() {
    // For empty messages, we don't need typing animation
    const botMessage = this.createChatBotMessage("Please type something to chat with me!")
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }))
  }

  handleError() {
    // Hide typing indicator if there was an error
    this.hideTypingIndicator()

    const botMessage = this.createChatBotMessage("Oops, something went wrong. Please try again!")
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }))
  }
}

export default ActionProvider
