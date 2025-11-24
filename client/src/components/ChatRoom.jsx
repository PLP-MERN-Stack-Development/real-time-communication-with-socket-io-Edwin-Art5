import { useState, useRef, useEffect } from 'react'
import { useSocket } from '../socket'
import MessageList from './MessageList'
import MessageForm from './MessageForm'
import UsersList from './UsersList'
import RoomsList from './RoomsList'
import useNotifications from '../hooks/useNotifications'

const ChatRoom = ({
  user,
  currentRoom,
  onRoomChange,
  onLogout,
  isConnected,
  users,
  messages,
  typingUsers
}) => {
  const { socket, setTyping, sendMessage, sendPrivateMessage } = useSocket()

  // Enable notifications
  useNotifications(messages, true)

  const handleSendMessage = (message) => {
    sendMessage(message)
  }

  const handleSendPrivateMessage = (to, message) => {
    sendPrivateMessage(to, message)
  }

  const handleTyping = (isTyping) => {
    setTyping(isTyping)
  }

  return (
    <div className="chat-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="user-info">
            <h3>{user.username}</h3>
            <button onClick={onLogout} className="logout-btn">
              Logout
            </button>
          </div>
          <div className="connection-status">
            <div className={`status-indicator ${isConnected ? 'status-connected' : 'status-disconnected'}`}></div>
            {isConnected ? 'Connected' : 'Disconnected'}
          </div>
        </div>

        <RoomsList
          currentRoom={currentRoom}
          onRoomChange={onRoomChange}
          socket={socket}
        />

        <UsersList
          users={users}
          currentUser={user}
          onPrivateMessage={handleSendPrivateMessage}
        />
      </div>

      {/* Main Chat Area */}
      <div className="chat-main">
        <div className="chat-header">
          <h2>#{currentRoom}</h2>
          <div className="room-info">
            {users.length} user{users.length !== 1 ? 's' : ''} online
          </div>
        </div>

        <MessageList
          messages={messages}
          currentUser={user}
          typingUsers={typingUsers}
        />

        <MessageForm
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
          disabled={!isConnected}
        />
      </div>
    </div>
  )
}

export default ChatRoom