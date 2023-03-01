import Image from "next/image"
import { FC } from "react"
import { IChecked, IOption } from "../GameScreen/GameScreenTypes"

interface MusicTrackIconProps {
  option: IOption
  checked: IChecked
  loadingAssets: boolean
  onClickHandler: (id: string, musicUrl: string) => void
}
const MusicTrackIcon: FC<MusicTrackIconProps> = ({
  option,
  checked,
  loadingAssets,
  onClickHandler,
}) => (
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
    {!loadingAssets && <Image src={option.imgUrl} alt={option.name} width={100} height={100} />}
  </button>
)

export default MusicTrackIcon
