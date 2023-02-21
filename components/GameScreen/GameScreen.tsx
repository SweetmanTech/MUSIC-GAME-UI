import { useState } from "react"
import Image from "next/image"
import _ from "lodash"
import MintButton from "../MintButton"
import { MUSIC_URLS } from "../../lib/consts"

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
  const [playAudio, setPlayAudio] = useState<boolean>(false)
  const [instrumentChoice, setInstrumentChoice] = useState<{
    drums: string | null
    vocal: string | null
    bass: string | null
    guitar: string | null
  }>({ drums: null, vocal: null, bass: null, guitar: null })
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
  const [musicUrl, setMusicUrl] = useState<string>("")
  const onMouseOverHandler = (value: string) => {
    if (checked[value]) return
    const musicChoice = _.sample(MUSIC_URLS[value])
    setInstrumentChoice({
      ...instrumentChoice,
      [value]: musicChoice,
    })
    setMusicUrl(musicChoice)
    setPlayAudio(true)
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 p-4 align-center">
      <div className="p-4 m-4 font-mono text-2xl font-extrabold text-gray-900 bg-white rounded-md">
        Pick any 2 instrutments, you can hover to hear possible choice.
      </div>
      <div className="flex flex-row ">
        {options.map((option) => (
          <div key={option.id}>
            <button
              key={option.id}
              type="button"
              className={`p-4 m-2 ${
                checked[option.id] ? `border-green-500` : "border-white-500"
              }  ${checked[option.id] ? "border-4" : "border-4"} rounded-full disabled:opacity-25`}
              onClick={() => onClickHandler(option.id)}
              onMouseEnter={() => {
                onMouseOverHandler(option.id)
              }}
              onMouseLeave={() => {
                setPlayAudio(false)
              }}
              disabled={choices.length === 2 && !choices.includes(option.id)}
            >
              <Image src={option.imgUrl} alt={option.name} width={100} height={100} />
            </button>
            {playAudio && musicUrl && !checked[option.id] && (
              <audio autoPlay>
                <source src={musicUrl} type="audio/mpeg" />
                <track kind="captions" />
              </audio>
            )}
          </div>
        ))}
      </div>

      {choices.length > 1 && (
        <MintButton choices={choices} onSuccess={onSuccess} instrumentUrl={instrumentChoice} />
      )}
    </div>
  )
}

export default GameScreen
