import { Contract } from "ethers"
import { useEffect, useState } from "react"
import { useAccount, useSigner } from "wagmi"
import getIpfsLink from "../../lib/getIpfsLink"
import getUnstakedTracks from "../../lib/getUnstakedTracks"
import MusicTrackIcon from "../Icons/MusicTrackIcon"
import abi from "../../lib/abi-musicGame.json"
import { stake } from "../../lib/stake"

const UnstakedTrackList = ({ onSuccess, loadingAssets }: any) => {
  const { address } = useAccount()
  const { data: signer } = useSigner()
  const [unstaked, setUnstaked] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      console.log("GET UNSTAKED SAMPLES")
      const response = await getUnstakedTracks(address)
      console.log("response", response)
      setUnstaked(response)
      setLoading(false)
    }
    init()
  }, [address, loadingAssets])

  const onClickHandler = async (tokenId: string) => {
    const contract = new Contract(process.env.NEXT_PUBLIC_MUSIC_GAME_CONTRACT_ADDRESS, abi, signer)
    const setPendingTxStep = console.log
    await stake(contract, tokenId, onSuccess, setPendingTxStep)
  }

  return (
    <div>
      <div className="text-center text-xl">click your track to add it to the game</div>
      {unstaked.map((token) => {
        console.log("unstaked token", token)
        return (
          <MusicTrackIcon
            key={token.id.tokenId}
            option={{
              id: token.id.tokenId,
              name: token.metadata.name,
              imgUrl: getIpfsLink(token.metadata.image),
              musicUrl: token.metadata.animation_url,
            }}
            checked={{ drums: false, vocal: false, bass: false, guitar: false }}
            onClickHandler={() => onClickHandler(parseInt(token.id.tokenId, 16).toString())}
            loadingAssets={loading}
          />
        )
      })}
    </div>
  )
}

export default UnstakedTrackList
