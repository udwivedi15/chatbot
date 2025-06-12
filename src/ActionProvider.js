class ActionProvider {
  constructor(createChatBotMessage, setStateFunc, createClientMessage) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.createClientMessage = createClientMessage;
  }

  // Show typing indicator
  showTypingIndicator = () => {
    this.setState((prevState) => ({
      ...prevState,
      isTyping: true,
    }));
  };

  // Hide typing indicator
  hideTypingIndicator = () => {
    this.setState((prevState) => ({
      ...prevState,
      isTyping: false,
    }));
  };

  async handleMessage(message) {
    this.showTypingIndicator();

    try {
      const response = await fetch(
        "https://sentiment-analysis-backend.gentleforest-3f29c387.southindia.azurecontainerapps.io/openapi.json",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ask: message }),
        }
      );

      // Check for HTTP error status
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      // Try parsing the JSON safely
      const contentType = response.headers.get("content-type");
      let data = {};

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const rawText = await response.text();
        console.warn("Unexpected content type. Raw response:", rawText);
        throw new Error("Response is not valid JSON.");
      }

      const answer = data?.answer || "Sorry, I didn’t get a valid reply from the server.";

      console.log("Full API Response:", data);
      console.log("GPT API Answer:", answer);

      this.hideTypingIndicator();

      const botMessage = this.createChatBotMessage(answer);
      this.setState((prev) => ({
        ...prev,
        messages: [...prev.messages, botMessage],
      }));
    } catch (error) {
      console.error("API Error:", error);
      this.handleError();
    }
  }

  handleEmptyMessage() {
    const botMessage = this.createChatBotMessage("Please type something to chat with me!");
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  }

  handleError() {
    this.hideTypingIndicator();

    const botMessage = this.createChatBotMessage("Oops, something went wrong. Please try again!");
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  }
}

export default ActionProvider;
