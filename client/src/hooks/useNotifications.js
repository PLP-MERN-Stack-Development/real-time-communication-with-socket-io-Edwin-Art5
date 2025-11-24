import { useEffect, useRef } from 'react'

const useNotifications = (messages, enabled = true) => {
  const prevMessagesCount = useRef(0)

  useEffect(() => {
    if (!enabled || !('Notification' in window)) {
      return
    }

    // Request permission for notifications
    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [enabled])

  useEffect(() => {
    if (!enabled || !('Notification' in window)) return

    const currentMessageCount = messages.length
    const previousMessageCount = prevMessagesCount.current

    // If there's a new message and the window is not focused
    if (currentMessageCount > previousMessageCount && !document.hasFocus()) {
      const latestMessage = messages[messages.length - 1]
      
      // Don't show notifications for system messages or user's own messages
      if (!latestMessage.system && !latestMessage.senderId) {
        // Check if we have permission
        if (Notification.permission === 'granted') {
          new Notification(`New message from ${latestMessage.sender}`, {
            body: latestMessage.message,
            icon: '/vite.svg',
            tag: 'chat-message'
          })
        }
      }
    }

    prevMessagesCount.current = currentMessageCount
  }, [messages, enabled])
}

export default useNotifications