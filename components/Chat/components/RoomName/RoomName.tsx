const RoomName = ({ setRoomName, setHasRoomName, roomName }) => (
  <div className="flex flex-col items-center justify-center gap-4 p-2 bg-white border rounded-md shadow-md w-80 h-96">
    <label htmlFor="success" className="block mb-2 text-lg font-medium text-black">
      Enter Room Name
    </label>
    <input
      type="text"
      id="room-name"
      className=" border border-black text-gray-900  block w-full h-1/6 p-2.5"
      placeholder="Room Name"
      onChange={(e) => {
        e.preventDefault()
        setRoomName(e.target.value)
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" && roomName.length > 0) {
          setHasRoomName(true)
        }
      }}
    />
    <button
      type="button"
      className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={() => {
        setHasRoomName(true)
      }}
      disabled={roomName.length === 0}
    >
      Enter
    </button>
  </div>
)

export default RoomName
