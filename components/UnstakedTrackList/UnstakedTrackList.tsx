import { Contract } from "ethers"
import { useEffect, useState } from "react"
import { useAccount, useSigner } from "wagmi"
import getIpfsLink from "../../lib/getIpfsLink"
import getUnstakedTracks from "../../lib/getUnstakedTracks"
import MusicTrackIcon from "../Icons/MusicTrackIcon"
import abi from "../../lib/abi-musicGame.json"
import { stake } from "../../lib/stake"
import SignInButton from "../SignInButton"

const UnstakedTrackList = ({ onSuccess, loadingAssets }: any) => {
  const { address } = useAccount()
  const { data: signer } = useSigner()
  const [unstaked, setUnstaked] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      setLoading(true)
      const response = await getUnstakedTracks(address)
      setUnstaked(response)
      setLoading(false)
    }
    if (!address) return
    init()
  }, [address, loadingAssets])

  const onClickHandler = async (tokenId: string) => {
    const contract = new Contract(process.env.NEXT_PUBLIC_MUSIC_GAME_CONTRACT_ADDRESS, abi, signer)
    await stake(contract, tokenId, onSuccess)
  }

  return (
    <div className="flex flex-col gap-3 justify-center items-center">
      <div className="text-center text-xl">
        {address
          ? "click your track to add it to the game"
          : "or sign in to add your music to the game"}
      </div>
      <div>
        {address ? (
          unstaked.map((token) => (
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
          ))
        ) : (
          <SignInButton />
        )}
      </div>
    </div>
  )
}

export default UnstakedTrackList
