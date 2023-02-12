import { useState } from "react"

const GameScreen = () => {
  const [choices, setChoices] = useState([])
  const [checked, setChecked] = useState({
    drums: false,
    vocal: false,
    bass: false,
    guitar: false,
  })
  const onClickHandler = (value: string) => {
    if (choices.includes(value)) {
      setChoices([...choices.filter((e) => e !== value)])
    } else {
      setChoices([...choices, value])
    }
    setChecked({ ...checked, [value]: !checked[value] })
  }
  return (
    <div className="flex flex-col h-screen align-center items-center justify-center gap-4">
      <div className="flex flex-row ">
        <button
          type="button"
          className={`p-4 m-2 border-red-${checked.drums ? "600" : "500"} border-${
            checked.drums ? "4" : "2"
          } rounded-2xl disabled:opacity-25`}
          onClick={() => onClickHandler("drums")}
          disabled={choices.length === 2 && !choices.includes("drums")}
        >
          Drums
        </button>
        <button
          type="button"
          className={`p-4 m-2 border-green-${checked.bass ? "600" : "500"} border-${
            checked.bass ? "4" : "2"
          } rounded-2xl disabled:opacity-25`}
          onClick={() => onClickHandler("bass")}
          disabled={choices.length === 2 && !choices.includes("bass")}
        >
          Bass
        </button>
        <button
          type="button"
          className={`p-4 m-2 border-blue-${checked.guitar ? "600" : "500"} border-${
            checked.guitar ? "4" : "2"
          } rounded-2xl disabled:opacity-25`}
          onClick={() => onClickHandler("guitar")}
          disabled={choices.length === 2 && !choices.includes("guitar")}
        >
          Guitar
        </button>
        <button
          type="button"
          className={`p-4 m-2 border-orange-${checked.vocal ? "600" : "500"} border-${
            checked.vocal ? "4" : "2"
          } rounded-2xl disabled:opacity-25`}
          onClick={() => onClickHandler("vocal")}
          disabled={choices.length === 2 && !choices.includes("vocal")}
        >
          Vocals
        </button>
      </div>
      {choices.length > 1 && (
        <div>
          <button type="button" className="p-4 m-2 border-purple-600 border-4 rounded-2xl">
            Remix
          </button>
        </div>
      )}
    </div>
  )
}

export default GameScreen
