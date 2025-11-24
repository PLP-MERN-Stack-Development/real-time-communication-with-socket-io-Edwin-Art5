import { useState } from 'react'

const UsersList = ({ users, currentUser, onPrivateMessage }) => {
  const [selectedUser, setSelectedUser] = useState(null)
  const [privateMessage, setPrivateMessage] = useState('')

  const handlePrivateMessage = (user) => {
    if (privateMessage.trim() && user.id !== currentUser.id) {
      onPrivateMessage(user.id, privateMessage.trim())
      setPrivateMessage('')
      setSelectedUser(null)
    }
  }

  return (
    <div className="users-section">
      <h4>Online Users ({users.length})</h4>
      <ul className="user-list">
        {users.map((user) => (
          <li key={user.id} className="user-item">
            <div className="user-status"></div>
            <span>{user.username}</span>
            {user.id !== currentUser.id && (
              <button
                onClick={() => setSelectedUser(selectedUser?.id === user.id ? null : user)}
                style={{ marginLeft: 'auto', fontSize: '12px', padding: '2px 6px' }}
              >
                PM
              </button>
            )}
            
            {selectedUser?.id === user.id && (
              <div style={{ marginTop: '5px', width: '100%' }}>
                <input
                  type="text"
                  value={privateMessage}
                  onChange={(e) => setPrivateMessage(e.target.value)}
                  placeholder={`Message ${user.username}...`}
                  style={{ width: '100%', fontSize: '12px', padding: '4px' }}
                  onKeyPress={(e) => e.key === 'Enter' && handlePrivateMessage(user)}
                />
                <div style={{ display: 'flex', gap: '5px', marginTop: '2px' }}>
                  <button
                    onClick={() => handlePrivateMessage(user)}
                    style={{ fontSize: '10px', padding: '2px 4px' }}
                  >
                    Send
                  </button>
                  <button
                    onClick={() => setSelectedUser(null)}
                    style={{ fontSize: '10px', padding: '2px 4px' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default UsersList