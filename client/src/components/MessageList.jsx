import { useEffect, useRef } from 'react'

const MessageList = ({ messages, currentUser, typingUsers }) => {
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const getMessageClass = (message) => {
    let className = 'message'
    if (message.system) {
      className += ' system'
    } else if (message.senderId === currentUser.id) {
      className += ' own'
    } else if (message.isPrivate) {
      className += ' private'
    }
    return className
  }

  return (
    <div className="messages-container">
      {messages.map((message) => (
        <div key={message.id} className={getMessageClass(message)}>
          {!message.system && (
            <div className="message-header">
              <span className="message-sender">
                {message.sender}
                {message.isPrivate && ' (Private)'}
              </span>
              <span className="message-timestamp">
                {formatTime(message.timestamp)}
              </span>
            </div>
          )}
          <div className="message-content">
            {message.message}
          </div>
        </div>
      ))}
      
      {typingUsers.length > 0 && (
        <div className="typing-indicator">
          {typingUsers.join(', ')} {typingUsers.length === 1 ? 'is' : 'are'} typing...
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  )
}

export default MessageList