import { useState, useEffect } from 'react'
import { useSocket } from './socket'
import Login from './components/Login'
import ChatRoom from './components/ChatRoom'
import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [currentRoom, setCurrentRoom] = useState('general')
  const {
    isConnected,
    connect,
    disconnect,
    users,
    messages,
    typingUsers
  } = useSocket()

  const handleLogin = (username) => {
    const userData = { username, room: currentRoom }
    setUser(userData)
    connect(userData)
  }

  const handleLogout = () => {
    disconnect()
    setUser(null)
  }

  const handleRoomChange = (room) => {
    setCurrentRoom(room)
    // Room switching will be handled in the ChatRoom component via socket
  }

  useEffect(() => {
    return () => {
      if (isConnected) {
        disconnect()
      }
    }
  }, [isConnected, disconnect])

  return (
    <div className="app">
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <ChatRoom
          user={user}
          currentRoom={currentRoom}
          onRoomChange={handleRoomChange}
          onLogout={handleLogout}
          isConnected={isConnected}
          users={users}
          messages={messages}
          typingUsers={typingUsers}
        />
      )}
    </div>
  )
}

export default App