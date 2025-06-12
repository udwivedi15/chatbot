class ActionProvider {
  constructor(createChatBotMessage, setStateFunc, createClientMessage) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.createClientMessage = createClientMessage;
  }

  showTypingIndicator = () => {
    this.setState((prevState) => ({
      ...prevState,
      isTyping: true,
    }));
  };

  hideTypingIndicator = () => {
    this.setState((prevState) => ({
      ...prevState,
      isTyping: false,
    }));
  };

  handleMessage = async (message) => {
    console.log("ActionProvider handleMessage called with:", message);
    if (!message || typeof message !== "string") {
      console.error("Invalid message:", message);
      this.handleEmptyMessage();
      return;
    }

    this.showTypingIndicator();

    try {
      const proxyUrl = "https://cors-anywhere.herokuapp.com/";
      const apiUrl = "https://sentiment-analysis-backend.gentleforest-3f29c387.southindia.azurecontainerapps.io/gpt/ask";
      const requestBody = JSON.stringify({ question: message });
      console.log("Request URL:", proxyUrl + apiUrl);
      console.log("Request body (stringified):", requestBody);

      const response = await fetch(proxyUrl + apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      });

      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text(); // Capture the error response body
        console.error("Error response from API:", errorText);
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

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

      const botMessage = this.createChatBotMessage(answer);
      this.setState((prev) => {
        const newState = {
          ...prev,
          messages: [...prev.messages, botMessage],
          isTyping: false,
        };
        console.log("Updated state:", newState);
        return newState;
      });
    } catch (error) {
      console.error("API Error:", error.message);
      console.error("Error stack:", error.stack);
      this.handleError();
    }
  };

  handleEmptyMessage = () => {
    console.log("Handling empty message");
    const botMessage = this.createChatBotMessage("Please type something to chat with me!");
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  handleError = () => {
    console.log("Handling error");
    this.hideTypingIndicator();
    const botMessage = this.createChatBotMessage("Sorry, something went wrong. Please try again.");
    this.setState((prev) => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };
}

export default ActionProvider;