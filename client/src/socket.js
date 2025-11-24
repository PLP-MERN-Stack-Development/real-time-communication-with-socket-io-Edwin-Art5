// socket.js - Enhanced version with reconnection logic

import { io } from 'socket.io-client';
import { useEffect, useState } from 'react';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// Create socket instance with enhanced options
export const socket = io(SOCKET_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
});

// Custom hook for using socket.io
export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [lastMessage, setLastMessage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [reconnectionAttempts, setReconnectionAttempts] = useState(0);

  // Connect to socket server
  const connect = (userData) => {
    socket.connect();
    if (userData) {
      socket.emit('user_join', userData);
    }
  };

  // Disconnect from socket server
  const disconnect = () => {
    socket.disconnect();
  };

  // Send a message
  const sendMessage = (message) => {
    socket.emit('send_message', { message });
  };

  // Send a private message
  const sendPrivateMessage = (to, message) => {
    socket.emit('private_message', { to, message });
  };

  // Set typing status
  const setTyping = (isTyping) => {
    socket.emit('typing', isTyping);
  };

  // Load more messages (pagination)
  const loadMoreMessages = (room, beforeTimestamp) => {
    socket.emit('load_messages', { room, before: beforeTimestamp });
  };

  // Socket event listeners
  useEffect(() => {
    // Connection events
    const onConnect = () => {
      setIsConnected(true);
      setReconnectionAttempts(0);
      console.log('Connected to server');
    };

    const onDisconnect = (reason) => {
      setIsConnected(false);
      console.log('Disconnected from server:', reason);
    };

    const onReconnectAttempt = (attempt) => {
      setReconnectionAttempts(attempt);
      console.log(`Reconnection attempt ${attempt}`);
    };

    const onReconnectFailed = () => {
      console.log('Reconnection failed');
    };

    // Message events
    const onReceiveMessage = (message) => {
      setLastMessage(message);
      setMessages((prev) => [...prev, message]);
    };

    const onPrivateMessage = (message) => {
      setLastMessage(message);
      setMessages((prev) => [...prev, message]);
    };

    const onMessageHistory = (history) => {
      setMessages(history);
    };

    // User events
    const onUserList = (userList) => {
      setUsers(userList);
    };

    const onUserJoined = (user) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          system: true,
          message: `${user.username} joined the chat`,
          timestamp: new Date().toISOString(),
        },
      ]);
    };

    const onUserLeft = (user) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          system: true,
          message: `${user.username} left the chat`,
          timestamp: new Date().toISOString(),
        },
      ]);
    };

    // Typing events
    const onTypingUsers = (users) => {
      setTypingUsers(users);
    };

    // Room events
    const onRoomJoined = (roomName) => {
      setMessages([]); // Clear messages when switching rooms
      console.log(`Joined room: ${roomName}`);
    };

    // Register event listeners
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('reconnect_attempt', onReconnectAttempt);
    socket.on('reconnect_failed', onReconnectFailed);
    socket.on('receive_message', onReceiveMessage);
    socket.on('private_message', onPrivateMessage);
    socket.on('message_history', onMessageHistory);
    socket.on('user_list', onUserList);
    socket.on('user_joined', onUserJoined);
    socket.on('user_left', onUserLeft);
    socket.on('typing_users', onTypingUsers);
    socket.on('room_joined', onRoomJoined);

    // Clean up event listeners
    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('reconnect_attempt', onReconnectAttempt);
      socket.off('reconnect_failed', onReconnectFailed);
      socket.off('receive_message', onReceiveMessage);
      socket.off('private_message', onPrivateMessage);
      socket.off('message_history', onMessageHistory);
      socket.off('user_list', onUserList);
      socket.off('user_joined', onUserJoined);
      socket.off('user_left', onUserLeft);
      socket.off('typing_users', onTypingUsers);
      socket.off('room_joined', onRoomJoined);
    };
  }, []);

  return {
    socket,
    isConnected,
    lastMessage,
    messages,
    users,
    typingUsers,
    reconnectionAttempts,
    connect,
    disconnect,
    sendMessage,
    sendPrivateMessage,
    setTyping,
    loadMoreMessages,
  };
};

export default socket;