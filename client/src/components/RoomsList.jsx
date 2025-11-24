import { useState, useEffect } from 'react'

const RoomsList = ({ currentRoom, onRoomChange, socket }) => {
  const [rooms, setRooms] = useState(['general', 'random', 'help'])
  const [newRoomName, setNewRoomName] = useState('')

  useEffect(() => {
    const handleRoomJoined = (roomName) => {
      if (!rooms.includes(roomName)) {
        setRooms(prev => [...prev, roomName])
      }
    }

    socket?.on('room_joined', handleRoomJoined)

    return () => {
      socket?.off('room_joined', handleRoomJoined)
    }
  }, [socket, rooms])

  const handleJoinRoom = (roomName) => {
    if (roomName !== currentRoom) {
      socket.emit('join_room', roomName)
      onRoomChange(roomName)
    }
  }

  const handleCreateRoom = () => {
    if (newRoomName.trim() && !rooms.includes(newRoomName.trim())) {
      const roomName = newRoomName.trim()
      handleJoinRoom(roomName)
      setNewRoomName('')
    }
  }

  return (
    <div className="rooms-section">
      <h4>Chat Rooms</h4>
      <ul className="room-list">
        {rooms.map(room => (
          <li
            key={room}
            className={`room-item ${room === currentRoom ? 'active' : ''}`}
            onClick={() => handleJoinRoom(room)}
          >
            #{room}
          </li>
        ))}
      </ul>
      
      <div style={{ marginTop: '10px' }}>
        <input
          type="text"
          value={newRoomName}
          onChange={(e) => setNewRoomName(e.target.value)}
          placeholder="New room name"
          style={{ width: '100%', padding: '5px', fontSize: '12px' }}
          onKeyPress={(e) => e.key === 'Enter' && handleCreateRoom()}
        />
        <button
          onClick={handleCreateRoom}
          style={{ width: '100%', marginTop: '5px', padding: '5px', fontSize: '12px' }}
          disabled={!newRoomName.trim()}
        >
          Create Room
        </button>
      </div>
    </div>
  )
}

export default RoomsList