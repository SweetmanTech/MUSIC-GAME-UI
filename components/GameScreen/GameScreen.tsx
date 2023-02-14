import { useEffect, useState } from "react"
import Crunker from "crunker"
import { NFTStorage } from "nft.storage"
import _ from "lodash"
import { toast } from "react-toastify"
import Image from "next/image"
import PopupModal from "../PopupModal"

const client = new NFTStorage({
  token: `${process?.env?.NEXT_PUBLIC_NFT_STORAGE_TOKEN}`,
})
const MUSIC_URLS = {
  drums: [
    "https://defient-music.s3.amazonaws.com/90_DRUMS_HIPHOP_001-SWEETS.wav",
    "https://defient-music.s3.amazonaws.com/120_DRUMS_RNB_001-KATEE.wav",
    "https://defient-music.s3.amazonaws.com/120_DRUMS_RNB_002-JOE.wav",
  ],
  vocal: [
    "https://defient-music.s3.amazonaws.com/120_MUSIC_Bbmin_RNB_002-MCKENNA.wav",
    "https://defient-music.s3.amazonaws.com/120_MISC_RNB_001-JEFF.wav",
    "https://defient-music.s3.amazonaws.com/120_MUSIC_Bbmin_RNB_001-SERENA.wav",
  ],
  bass: [
    "https://defient-music.s3.amazonaws.com/120_MUSIC_Bbmin_RNB_002-MCKENNA.wav",
    "https://defient-music.s3.amazonaws.com/90_DRUMS_HIPHOP_002-SAMEER.wav",
    "https://defient-music.s3.amazonaws.com/90_DRUMS_TRAP_001-MARION.wav",
  ],
  guitar: [
    "https://defient-music.s3.amazonaws.com/90_MISC_HIPHOP_001-SHANE.wav",
    "https://defient-music.s3.amazonaws.com/90_MUSIC_Bbmin_HIPHOP_001-MICHAEL.wav",
    "https://defient-music.s3.amazonaws.com/90_MUSIC_Bbmin_HIPHOP_002-DOM.wav",
  ],
}
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
const GameScreen = () => {
  const [choices, setChoices] = useState<Array<string>>([])
  const [checked, setChecked] = useState<IChecked>({
    drums: false,
    vocal: false,
    bass: false,
    guitar: false,
  })
  const [cid, setCid] = useState<string>("")
  const [mixing, setMixing] = useState<boolean>(false)
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
  const remixHandler = async () => {
    setMixing(true)
    const crunker = new Crunker()
    const buffers = await crunker.fetchAudio(
      _.sample(MUSIC_URLS[choices[0]]),
      _.sample(MUSIC_URLS[choices[1]]),
    )
    const merged = await crunker.mergeAudio(buffers)
    const output = await crunker.export(merged, "audio/wav")
    const CID = await client.storeBlob(output.blob)
    setCid(CID)
    setMixing(false)
    setChoices([])
    setChecked({ drums: false, vocal: false, bass: false, guitar: false })
  }
  useEffect(() => {
    if (cid) {
      toast.success(`🎉 Remix created!, check it out at ipfs://${cid}`)
    }
  }, [cid])
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
      {choices.length > 1 && (
        <div>
          <button
            type="button"
            className="p-4 m-2 border-4 border-purple-600 rounded-full"
            onClick={remixHandler}
          >
            Remix
          </button>
        </div>
      )}
      {mixing && <PopupModal open={mixing} />}
    </div>
  )
}

export default GameScreen
