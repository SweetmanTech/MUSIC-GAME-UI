/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Server } from "socket.io"

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log("Socket is already running")
    res.end()
    return
  }
  const io = new Server(res.socket.server, { cors: { origin: "*" }, path: "/api/socket" })
  res.socket.server.io = io

  io.on("connection", (socket) => {
    socket.on("newChatMessage", (data) => {
      console.log("newChatMessage", data)
      io.emit("newChatMessage", data)
    })
  })
  console.log("Setting up socket")
  res.end()
}

export default SocketHandler
