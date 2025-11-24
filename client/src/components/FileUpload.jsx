import { useState } from 'react'

const FileUpload = ({ onFileUpload, disabled }) => {
  const [isUploading, setIsUploading] = useState(false)

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Basic file validation
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      alert('File size must be less than 5MB')
      return
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'text/plain']
    if (!allowedTypes.includes(file.type)) {
      alert('File type not supported. Please upload images, PDFs, or text files.')
      return
    }

    setIsUploading(true)
    try {
      // In a real app, you would upload to a server and get a URL
      // For this demo, we'll create a mock file message
      const fileMessage = `[FILE] ${file.name} (${(file.size / 1024).toFixed(1)}KB)`
      onFileUpload(fileMessage)
    } catch (error) {
      console.error('File upload error:', error)
      alert('Failed to upload file')
    } finally {
      setIsUploading(false)
      e.target.value = '' // Reset input
    }
  }

  return (
    <div style={{ marginRight: '10px' }}>
      <input
        type="file"
        id="file-upload"
        onChange={handleFileSelect}
        disabled={disabled || isUploading}
        style={{ display: 'none' }}
        accept="image/*,application/pdf,text/plain"
      />
      <label htmlFor="file-upload" className="send-btn" style={{ cursor: 'pointer' }}>
        {isUploading ? 'Uploading...' : '📎'}
      </label>
    </div>
  )
}

export default FileUpload