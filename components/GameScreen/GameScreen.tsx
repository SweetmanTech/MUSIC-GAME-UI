import { useCallback, useEffect, useState, useMemo } from "react"
import axios from "axios"
import MintButton from "../MintButton"
import { MUSIC_URLS } from "../../lib/consts"
import MediaControls from "./components/MediaControls"
import MusicTrackIcon from "../Icons/MusicTrackIcon"
import { IChecked, IOption } from "./GameScreenTypes"

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
    const { data: newOptions } = await axios.get("/api/getStakedTracks")
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

  const MediaControlHandler = (isPlaying: boolean) => {
    if (isPlaying) {
      stopAudio()
    } else {
      setPlayAudio(true)
      context.resume()
    }
  }
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
      <div className="flex flex-wrap overflow-x-auto">
        {options.map((option) => (
          <MusicTrackIcon
            key={option.id}
            option={option}
            checked={checked}
            onClickHandler={onClickHandler}
            loadingAssets={loadingAssets}
          />
        ))}
      </div>
      <div className="flex flex-row-reverse gap-4">
        {chosenAudioTracks.length > 0 && (
          <MediaControls playAudio={playAudio} MediaControlHandler={MediaControlHandler} />
        )}
        {choices.length > 1 && (
          <MintButton onSuccess={onSuccess} audioTracksToMix={chosenAudioTracks} />
        )}
      </div>
    </div>
  )
}

export default GameScreen
