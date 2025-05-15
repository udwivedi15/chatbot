import dataset from './dataset';
class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.dataset = dataset; 
  }
  handleMessage(message) {
    const matchedItem = this.dataset.find(
      (item) => item.question.toLowerCase().includes(message)
    );

    const response = matchedItem
      ? matchedItem.answer
      : "Sorry, I didn't understand that. Try something like 'Tell me a joke' or 'What's your name?'";

    const botMessage = this.createChatBotMessage(response);
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
    this.setState((state) => ({
      ...state,
      typing: true,
    }));
  }
  





  


















  handleEmptyMessage() {
    const botMessage = this.createChatBotMessage("Please type something to chat with me!");
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  }

  handleError() {
    const botMessage = this.createChatBotMessage("Oops, something went wrong. Please try again!");
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  }
}
export default ActionProvider;