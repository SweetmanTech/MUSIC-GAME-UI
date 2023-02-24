import { useState } from "react"
import dynamic from "next/dynamic"
import RoomName from "./components/RoomName"
import ChatButton from "./components/ChatButton"

const ChatBox = dynamic(() => import("./components/ChatBox"), { ssr: false })

const Chat = () => {
  const [openChat, setOpenChat] = useState(false)
  const [roomName, setRoomName] = useState("")
  const [hasRoomName, setHasRoomName] = useState(false)
  return (
    <div className="fixed bottom-4 right-4">
      <div className="flex space-x-4">
        <ChatButton setOpenChat={setOpenChat} openChat={openChat} />
        {openChat && !hasRoomName && (
          <RoomName setRoomName={setRoomName} setHasRoomName={setHasRoomName} roomName={roomName} />
        )}
        {openChat && hasRoomName && <ChatBox setOpenChat={setOpenChat} roomName={roomName} />}
      </div>
    </div>
  )
}

export default Chat
