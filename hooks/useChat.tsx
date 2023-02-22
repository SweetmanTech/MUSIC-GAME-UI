import { useCallback, useEffect, useRef, useState } from "react"

import { io } from "socket.io-client"

const NEW_CHAT_MESSAGE_EVENT = "newChatMessage" // Name of the event

const useChat = () => {
  const [messages, setMessages] = useState([])
  const socketRef = useRef(null) // Sent and received messages
  const socketInitializer = useCallback(async (): Promise<void> => {
    fetch("/api/socket").finally(() => {
      socketRef.current = io()
      socketRef.current.on(NEW_CHAT_MESSAGE_EVENT, (message) => {
        const incomingMessage = {
          ...message,
          ownedByCurrentUser: message.senderId === socketRef.current.id,
        }
        setMessages([...messages, incomingMessage])
      })
    })
  }, [messages])

  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect()
    }
  }, [])
  useEffect(() => {
    socketInitializer()
    return () => {
      disconnectSocket()
    }
  }, [socketInitializer, disconnectSocket])
  // Sends a message to the server that
  // forwards it to all users in the same room
  const sendMessage = (messageBody) => {
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, {
      body: messageBody,
      senderId: socketRef.current.id,
    })
  }
  return { messages, sendMessage }
}

export default useChat
