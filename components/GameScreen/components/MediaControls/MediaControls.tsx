import { FC } from "react"
import PauseIcon from "../../../Icons/PauseIcon"
import PlayIcon from "../../../Icons/PlayIcon"

interface MediaControlsProps {
  playAudio: boolean
  MediaControlHandler: (playAudio: boolean) => void
}
const MediaControls: FC<MediaControlsProps> = ({ playAudio, MediaControlHandler }) => (
  <button
    type="button"
    onClick={() => {
      MediaControlHandler(playAudio)
    }}
  >
    {!playAudio ? <PlayIcon /> : <PauseIcon />}
  </button>
)

export default MediaControls
