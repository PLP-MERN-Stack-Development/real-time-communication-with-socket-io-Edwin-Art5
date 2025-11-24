import { useState, useRef, useEffect } from 'react'
import FileUpload from './FileUpload'

const MessageForm = ({ onSendMessage, onTyping, disabled }) => {
  const [message, setMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const typingTimeoutRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (message.trim() && !disabled) {
      onSendMessage(message.trim())
      setMessage('')
      stopTyping()
    }
  }

  const handleInputChange = (e) => {
    setMessage(e.target.value)
    
    if (!isTyping) {
      setIsTyping(true)
      onTyping(true)
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping()
    }, 1000)
  }

  const stopTyping = () => {
    if (isTyping) {
      setIsTyping(false)
      onTyping(false)
    }
  }

  const handleFileUpload = (fileMessage) => {
    onSendMessage(fileMessage)
  }

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
      stopTyping()
    }
  }, [])

  return (
    <form onSubmit={handleSubmit} className="message-form">
      <FileUpload onFileUpload={handleFileUpload} disabled={disabled} />
      <input
        type="text"
        value={message}
        onChange={handleInputChange}
        placeholder="Type a message..."
        className="message-input"
        disabled={disabled}
        maxLength={500}
      />
      <button 
        type="submit" 
        className="send-btn"
        disabled={!message.trim() || disabled}
      >
        Send
      </button>
    </form>
  )
}

export default MessageForm