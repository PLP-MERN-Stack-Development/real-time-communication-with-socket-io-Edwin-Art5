import { useState } from 'react'

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (username.trim() && !isLoading) {
      setIsLoading(true)
      try {
        await onLogin(username.trim())
      } finally {
        setIsLoading(false)
      }
    }
  }

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Join the Chat</h2>
        <input
          type="text"
          placeholder="Enter your username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          maxLength={20}
          disabled={isLoading}
        />
        <button type="submit" disabled={!username.trim() || isLoading}>
          {isLoading ? 'Joining...' : 'Join Chat'}
        </button>
      </form>
    </div>
  )
}

export default Login