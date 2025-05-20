"use client"

import { useState, type FormEvent } from "react"

interface CustomSendButtonProps {
  onClick: (e: FormEvent) => void
  disabled?: boolean
}

export default function CustomSendButton({ onClick, disabled = false }: CustomSendButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <button
      className="custom-send-button"
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Send message"
      type="submit"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`transition-transform duration-300 ${isHovered ? "translate-x-0.5" : ""}`}
      >
        <line x1="22" y1="2" x2="11" y2="13"></line>
        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
      </svg>
    </button>
  )
}
