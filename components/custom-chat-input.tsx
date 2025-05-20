"use client"

import { type FormEvent, type KeyboardEvent, useRef } from "react"
import CustomSendButton from "./custom-send-button"

interface CustomChatInputProps {
  placeholder?: string
  disableSendButton?: boolean
  // Add any props that react-chatbot-kit passes to the input component
  userInput?: string
  onSubmit?: (e: FormEvent) => void
  setUserInput?: (input: string) => void
}

export default function CustomChatInput({
  placeholder = "Type your message here...",
  disableSendButton = false,
  userInput = "",
  onSubmit,
  setUserInput,
}: CustomChatInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (userInput.trim() && !disableSendButton && onSubmit) {
      onSubmit(e)
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (userInput.trim() && !disableSendButton) {
        const form = (e.target as HTMLElement).closest("form")
        if (form) {
          form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }))
        }
      }
    }
  }

  return (
    <div className="custom-chat-input-container">
      <input
        ref={inputRef}
        className="react-chatbot-kit-chat-input"
        placeholder={placeholder}
        value={userInput}
        onChange={(e) => setUserInput && setUserInput(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <CustomSendButton onClick={handleSubmit} disabled={!userInput.trim() || disableSendButton} />
    </div>
  )
}
