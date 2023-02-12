import { useState } from "react"

const GameScreen = () => {
  const [choices, setChoices] = useState([])
  return (
    <div className="flex flex-col h-screen align-center items-center justify-center gap-4">
      <div className="flex flex-row ">
        <button
          type="button"
          className="p-4 m-2 border-red-600 border-4 rounded-2xl"
          onClick={() => setChoices([...choices, "drums"])}
          disabled={choices.length === 2}
        >
          Drums
        </button>
        <button
          type="button"
          className="p-4 m-2 border-green-600 border-4 rounded-2xl"
          onClick={() => setChoices([...choices, "bass"])}
          disabled={choices.length === 2}
        >
          Bass
        </button>
        <button
          type="button"
          className="p-4 m-2 border-blue-600 border-4 rounded-2xl"
          onClick={() => setChoices([...choices, "guitar"])}
          disabled={choices.length === 2}
        >
          Guitar
        </button>
        <button
          type="button"
          className="p-4 m-2 border-orange-600 border-4 rounded-2xl"
          onClick={() => setChoices([...choices, "vocal"])}
          disabled={choices.length === 2}
        >
          Vocals
        </button>
      </div>
      {choices.length > 1 && (
        <div>
          <button type="button">Remix</button>
        </div>
      )}
    </div>
  )
}

export default GameScreen
