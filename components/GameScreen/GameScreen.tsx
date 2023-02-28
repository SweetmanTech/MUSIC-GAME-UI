import { useCallback, useEffect, useState, useMemo } from "react"
import Image from "next/image"
import MintButton from "../MintButton"
import { MUSIC_URLS } from "../../lib/consts"
import getStakedTrackLib from "../../lib/getStakedTracks"

interface IOption {
  id: string
  name: string
  imgUrl?: string
  musicUrl?: string
}
interface IChecked {
  drums: boolean
  vocal: boolean
  bass: boolean
  guitar: boolean
}

const GameScreen = ({ onSuccess }: any) => {
  const [loadingAssets, setLoadingAssets] = useState<boolean>(true)
  const context = useMemo(() => new AudioContext(), [])
  const bufferSources = useMemo(() => [], [])
  const [choices, setChoices] = useState<Array<string>>([])
  const [checked, setChecked] = useState<IChecked>({
    drums: false,
    vocal: false,
    bass: false,
    guitar: false,
  })
  const [playAudio, setPlayAudio] = useState<boolean>(false)
  const [chosenAudioTracks, setChosenAudioTrack] = useState<Array<string>>([])
  const [options, setOptions] = useState<IOption[]>([
    { id: "bass", name: "Bass", imgUrl: "/bass.png", musicUrl: MUSIC_URLS.bass[0] },
    { id: "drums", name: "Drums", imgUrl: "/drums.png", musicUrl: MUSIC_URLS.drums[0] },
    { id: "guitar", name: "Guitar", imgUrl: "/guitar.png", musicUrl: MUSIC_URLS.guitar[0] },
    { id: "vocal", name: "Vocals", imgUrl: "/vocal.png", musicUrl: MUSIC_URLS.vocal[0] },
  ])

  const getStakedTracks = useCallback(async () => {
    const newOptions = await getStakedTrackLib()
    setOptions([...options, ...newOptions])
    setLoadingAssets(false)
  }, [options])

  useEffect(() => {
    if (loadingAssets) {
      getStakedTracks()
    }
  }, [loadingAssets, getStakedTracks])

  const stopAudio = useCallback(() => {
    setPlayAudio(false)
    context.suspend()
    bufferSources.forEach((source) => {
      source.stop()
    })
  }, [bufferSources, context])

  const onClickHandler = (value: string, musicUrl: string) => {
    if (choices.includes(value)) {
      setChoices([...choices.filter((e) => e !== value)])
      stopAudio()
      setChosenAudioTrack([...chosenAudioTracks.filter((e) => e !== musicUrl)])
    } else {
      setChoices([...choices, value])
      stopAudio()
      setChosenAudioTrack([...chosenAudioTracks, musicUrl])
    }
    setChecked({ ...checked, [value]: !checked[value] })
  }
  const play = useCallback(
    (audioBuffer: AudioBuffer) => {
      const source = context.createBufferSource()
      bufferSources.push(source)
      source.buffer = audioBuffer
      source.connect(context.destination)
      source.start()
    },
    [context, bufferSources],
  )
  const fetchAudio = useCallback(
    async (url: string) => {
      const response = await fetch(url)
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await context.decodeAudioData(arrayBuffer)
      return audioBuffer
    },
    [context],
  )
  const playTracks = useCallback(() => {
    chosenAudioTracks.forEach((track) => {
      fetchAudio(track).then((audioBuffer) => {
        play(audioBuffer)
      })
    })
  }, [chosenAudioTracks, fetchAudio, play])
  useEffect(() => {
    if (chosenAudioTracks.length === 0) {
      setPlayAudio(false)
      stopAudio()
    }
  }, [chosenAudioTracks, bufferSources, stopAudio])
  useEffect(() => {
    if ((chosenAudioTracks.length, playAudio)) {
      playTracks()
    }
    if (!playAudio && chosenAudioTracks.length > 0 && context.state === "suspended") {
      stopAudio()
    }
  }, [chosenAudioTracks, fetchAudio, playTracks, playAudio, context, stopAudio])
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-4 align-center">
      <div className="p-4 m-4 font-mono text-2xl font-extrabold text-gray-900 bg-white rounded-md">
        Pick any music, you can click play to hear possible choice.
      </div>
      <ul className="flex flex-wrap overflow-x-auto">
        {options.map((option) => (
          <li key={option.id} className="flex-none">
            <button
              key={option.id}
              type="button"
              className={`p-4 m-2 flex-none ${
                checked[option.id] ? `border-green-500` : "border-white-500"
              }  ${checked[option.id] ? "border-4" : "border-4"} rounded-full disabled:opacity-25 ${
                loadingAssets && "animate-pulse bg-gray-400 cursor-not-allowed"
              } w-[100px] h-[100px]`}
              onClick={() => onClickHandler(option.id, option.musicUrl)}
              disabled={loadingAssets}
            >
              {!loadingAssets && (
                <Image src={option.imgUrl} alt={option.name} width={100} height={100} />
              )}
            </button>
          </li>
        ))}
      </ul>
      <div className="flex flex-row-reverse gap-4">
        {chosenAudioTracks.length > 0 &&
          (!playAudio ? (
            <button
              type="button"
              onClick={() => {
                setPlayAudio(true)
                context.resume()
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"
                />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                setPlayAudio(false)
                context.suspend()
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15.75 5.25v13.5m-7.5-13.5v13.5"
                />
              </svg>
            </button>
          ))}
        {choices.length > 1 && (
          <MintButton onSuccess={onSuccess} audioTracksToMix={chosenAudioTracks} />
        )}
      </div>
    </div>
  )
}

export default GameScreen
