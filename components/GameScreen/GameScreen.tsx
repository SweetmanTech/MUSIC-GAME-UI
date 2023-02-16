import { useEffect, useState } from "react"
import Crunker from "crunker"
import { NFTStorage } from "nft.storage"
import _ from "lodash"
import { toast } from "react-toastify"
import Image from "next/image"
import PopupModal from "../PopupModal"
import MintButton from "../MintButton"

interface IOption {
  id: string
  name: string
  imgUrl?: string
}
interface IChecked {
  drums: boolean
  vocal: boolean
  bass: boolean
  guitar: boolean
}
const GameScreen = ({ onSuccess }: any) => {
  const [choices, setChoices] = useState<Array<string>>([])
  const [checked, setChecked] = useState<IChecked>({
    drums: false,
    vocal: false,
    bass: false,
    guitar: false,
  })
  const options: IOption[] = [
    { id: "bass", name: "Bass", imgUrl: "/bass.png" },
    { id: "drums", name: "Drums", imgUrl: "/drums.png" },
    { id: "guitar", name: "Guitar", imgUrl: "/guitar.png" },
    { id: "vocal", name: "Vocals", imgUrl: "/vocal.png" },
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
            className={`p-4 m-2 ${checked[option.id] ? `border-green-500` : "border-white-500"}  ${
              checked[option.id] ? "border-4" : "border-4"
            } rounded-full disabled:opacity-25`}
            onClick={() => onClickHandler(option.id)}
            disabled={choices.length === 2 && !choices.includes(option.id)}
          >
            <Image src={option.imgUrl} alt={option.name} width={100} height={100} />
          </button>
        ))}
      </div>

      {choices.length > 1 && <MintButton choices={choices} onSuccess={onSuccess} />}
    </div>
  )
}

export default GameScreen
