import type { NextPage } from "next"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import { io } from "socket.io-client"
import SeoHead from "../components/SeoHead"
import LaunchPage from "../components/LaunchPage"
import Results from "../components/Results"
import ChatBox from "../components/ChatBox"

const GameScreen = dynamic(() => import("../components/GameScreen"), { ssr: false })
let socket
const Home: NextPage = () => {
  const [entered, setEntered] = useState(false)
  const [metadata, setMetadata] = useState()
  const [openChat, setOpenChat] = useState(false)
  const socketInitializer = async (): Promise<void> => {
    await fetch("/api/socket")
    socket = io()

    socket.on("connect", () => {
      console.log("connected")
    })
    return null
  }
  useEffect(() => {
    socketInitializer()
  }, [])

  return (
    <div className="bg-[#010e17] text-white">
      <SeoHead title="Music Game" description="Music Game coming soon" image="" />

      {!entered && <LaunchPage onClick={setEntered} />}
      {entered && !metadata && <GameScreen onSuccess={setMetadata} />}
      {metadata && <Results metadata={metadata} />}
      <div className="fixed bottom-4 right-4">
        <div className="flex space-x-4">
          {!openChat && (
            <button type="button" onClick={() => setOpenChat(true)}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-10 h-10"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.068.157 2.148.279 3.238.364.466.037.893.281 1.153.671L12 21l2.652-3.978c.26-.39.687-.634 1.153-.67 1.09-.086 2.17-.208 3.238-.365 1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                />
              </svg>
            </button>
          )}
          {openChat && <ChatBox setOpenChat={setOpenChat} />}
        </div>
      </div>
    </div>
  )
}

export default Home
