import { useState } from "react"

interface IOption {
  id: string
  name: string
  borderColor: string
  imgUrl?: string
}
const GameScreen = () => {
  const [choices, setChoices] = useState([])
  const [checked, setChecked] = useState({
    drums: false,
    vocal: false,
    bass: false,
    guitar: false,
  })
  const options: IOption[] = [
    { id: "drums", name: "Drums", borderColor: "red" },
    { id: "bass", name: "Bass", borderColor: "green" },
    { id: "guitar", name: "Guitar", borderColor: "blue" },
    { id: "vocal", name: "Vocals", borderColor: "orange" },
  ]
  const onClickHandler = (value: string) => {
    if (choices.includes(value)) {
      setChoices([...choices.filter((e) => e !== value)])
    } else {
      setChoices([...choices, value])
    }
    setChecked({ ...checked, [value]: !checked[value] })
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 align-center">
      <div className="flex flex-row ">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            className={`p-4 m-2 border-${option.borderColor}-${
              checked[option.id] ? "600" : "500"
            } border-${checked[option.id] ? "4" : "2"} rounded-2xl disabled:opacity-25`}
            onClick={() => onClickHandler(option.id)}
            disabled={choices.length === 2 && !choices.includes(option.id)}
          >
            {option.name}
          </button>
        ))}
      </div>
      {choices.length > 1 && (
        <div>
          <button type="button" className="p-4 m-2 border-4 border-purple-600 rounded-2xl">
            Remix
          </button>
        </div>
      )}
    </div>
  )
}

export default GameScreen
