import { useState } from "react"
import useChat from "../../../../hooks/useChat"
/* eslint-disable @next/next/no-img-element */
const ChatBox = ({ setOpenChat, roomName }) => {
  const [newMessage, setNewMessage] = useState("")
  const { messages, ably, messageEnd, sendChatMessage } = useChat(
    roomName.toLowerCase().replace(" ", "-"),
  )

  const handleNewMessageChange = (event) => {
    setNewMessage(event.target.value)
  }
  const handleSendMessage = () => {
    sendChatMessage(newMessage)
    setNewMessage("")
  }

  const myMessage = (message) => (
    <div className="flex flex-row-reverse items-center mb-4">
      <div className="flex flex-col items-center flex-none ml-4 space-y-1">
        <img
          alt=""
          className="w-10 h-10 rounded-full"
          src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        />
        <div className="text-sm text-black">Me</div>
      </div>
      <div className="relative flex-1 p-2 mb-2 text-gray-800 bg-indigo-100 rounded-lg">
        <div>{message.data}</div>

        {/* <!-- arrow --> */}
        <div className="absolute right-0 w-2 h-2 transform rotate-45 translate-x-1/2 bg-indigo-100 top-1/2" />
        {/* <!-- end arrow --> */}
      </div>
    </div>
  )

  const otherMessage = (message) => (
    <div className="flex items-center mb-4">
      <div className="flex flex-col items-center flex-none mr-4 space-y-1">
        <img
          alt=""
          className="w-10 h-10 rounded-full"
          src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
        />
        <div className="text-sm text-black">{message.connectionId}</div>
      </div>
      <div className="relative flex-1 p-2 mb-2 text-white bg-indigo-400 rounded-lg">
        <div>{message.data}</div>

        {/* <!-- arrow --> */}
        <div className="absolute left-0 w-2 h-2 transform rotate-45 -translate-x-1/2 bg-indigo-400 top-1/2" />
        {/* <!-- end arrow --> */}
      </div>
    </div>
  )
  return (
    // <!-- chat box -->

    <div className="flex flex-col bg-white border rounded-md shadow-md w-80 h-96">
      <div className="flex items-center justify-between p-2 border-b">
        {/* <!-- user info --> */}
        <div className="flex items-center">
          <div className="pl-2">
            <div className="font-semibold">
              <div className="text-black hover:underline">{roomName}</div>
            </div>
          </div>
        </div>
        {/* <!-- end user info --> */}
        {/* <!-- chat box action --> */}
        <div>
          <button
            className="inline-flex p-2 bg-indigo-200 rounded-full hover:bg-indigo-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            type="button"
            onClick={() => setOpenChat(false)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        {/* <!-- end chat box action --> */}
      </div>

      <div className="flex-1 h-full px-4 py-4 overflow-y-auto">
        {messages.map((message) => {
          if (message.connectionId === ably.connection.id) {
            return myMessage(message)
          }
          return otherMessage(message)
        })}
        <div
          ref={(element) => {
            messageEnd.current = element
          }}
        />
      </div>

      <div className="flex items-center p-2 border-t">
        <div className="w-full">
          <input
            className="w-full h-12 p-2 text-black border border-gray-200 rounded-full"
            type="text"
            value={newMessage}
            placeholder="Aa"
            onChange={(e) => handleNewMessageChange(e)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.stopPropagation()
                e.preventDefault()
                handleSendMessage()
              }
            }}
          />
        </div>

        {/* <!-- chat send action --> */}

        <div>
          <button
            className="inline-flex p-2 bg-indigo-500 rounded-full"
            type="button"
            onClick={() => handleSendMessage()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </button>
        </div>

        {/* <!-- end chat send action --> */}
      </div>
    </div>
  )
}
// <!-- end chat box -->

export default ChatBox
