import { createMessageWithId } from './config'; // Import createMessageWithId

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc, createClientMessage) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.createClientMessage = createClientMessage;
  }

  showTypingIndicator = () => {
    this.setState((prev) => ({
      ...prev,
      isTyping: true,
    }));
  };

  hideTypingIndicator = () => {
    this.setState((prev) => ({
      ...prev,
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
      const apiUrl = "https://sentiment-analysis-backend.gentleforest-3f29c387.southindia.azurecontainerapps.io/gpt/ask";
      const requestBody = JSON.stringify({ question: message });
      console.log("Request URL:", apiUrl);
      console.log("Request body (stringified):", requestBody);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const minDelay = new Promise((resolve) => setTimeout(resolve, 1000)); // 1s minimum delay

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log("Response status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
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
        data = { answer: rawText };
      }

      const answer = data?.answer || "Sorry, I didn’t get a valid reply from the server.";
      console.log("Full API Response:", data);
      console.log("GPT API Answer:", answer);

      await minDelay;

      const botMessage = createMessageWithId(answer, { withAvatar: false });
      console.log("Created botMessage with ID:", botMessage.id); // Debug log
      this.setState((prev) => {
        const newState = {
          ...prev,
          messages: [...prev.messages, botMessage],
          isTyping: false,
        };
        console.log("Updated state with new message ID:", botMessage.id, "State:", newState);
        return newState;
      });
    } catch (error) {
      console.error("API Error:", error.message);
      console.error("Error stack:", error.stack);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      this.handleError(error);
    }
  };

  handleEmptyMessage = () => {
    console.log("Handling empty message");
    const botMessage = createMessageWithId("Please type something to chat with me!", { withAvatar: false });
    console.log("Created botMessage with ID (empty message):", botMessage.id); // Debug log
    this.setState((prev) => {
      const newState = {
        ...prev,
        messages: [...prev.messages, botMessage],
        isTyping: false,
      };
      console.log("Updated state with new message ID (empty message):", botMessage.id, "State:", newState);
      return newState;
    });
  };

  handleError = (error = new Error("Unknown error")) => {
    console.log("Handling error:", error.message);
    const botMessage = createMessageWithId(`Sorry, something went wrong: ${error.message}. Please try again.`, { withAvatar: false });
    console.log("Created botMessage with ID (error):", botMessage.id); // Debug log
    this.setState((prev) => {
      const newState = {
        ...prev,
        messages: [...prev.messages, botMessage],
        isTyping: false,
      };
      console.log("Updated state with new message ID (error):", botMessage.id, "State:", newState);
      return newState;
    });
  };
}

export default ActionProvider;