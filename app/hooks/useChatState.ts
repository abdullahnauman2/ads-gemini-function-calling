import { useState } from "react";
import { ChatMessage, ChatResponse } from "@/lib/types";

export const useChatState = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const createUserMessage = (content: string): ChatMessage => ({
    id: Date.now().toString(),
    type: "user",
    content: content.trim(),
    timestamp: new Date(),
  });

  const createAssistantMessage = (
    data: ChatResponse,
    processingTime: number
  ): ChatMessage => ({
    id: (Date.now() + 1).toString(),
    type: "assistant",
    content: data.response,
    timestamp: new Date(),
    debugInfo: {
      functionCalled: data.functionCalled || false,
      rawData: data.data,
      processingTime,
    },
  });

  const createErrorMessage = (): ChatMessage => ({
    id: (Date.now() + 1).toString(),
    type: "assistant",
    content: "Sorry, there was an error processing your request.",
    timestamp: new Date(),
  });

  const addMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = createUserMessage(message);
    addMessage(userMessage);
    setMessage("");
    setLoading(true);

    const startTime = Date.now();

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: message.trim(),
          history: messages,
        }),
      });

      const data: ChatResponse = await response.json();
      const processingTime = Date.now() - startTime;

      const assistantMessage = createAssistantMessage(data, processingTime);
      addMessage(assistantMessage);
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = createErrorMessage();
      addMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    message,
    setMessage,
    messages,
    loading,
    handleSubmit,
  };
};
