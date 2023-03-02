import { Contract } from "ethers"
import getProvider from "./getProvider"
import abi from "./abi-musicGame.json"
import getIpfsLink from "./getIpfsLink"
import getNfts from "./getNfts"
import { DecodedURI } from "../components/GameScreen/GameScreenTypes"

const getUnstakedTracks = async (address: string) => {
  const contract = new Contract(
    process.env.NEXT_PUBLIC_MUSIC_GAME_CONTRACT_ADDRESS,
    abi,
    getProvider(),
  )

  const alchemyTokens = await getNfts(address, process.env.NEXT_PUBLIC_MUSIC_GAME_CONTRACT_ADDRESS)
  console.log("alchemyTokens", alchemyTokens)
  const stakedRaw = await contract.cre8ingTokens()
  const stakedStrings = stakedRaw.map((token) => token.toString())
  const stakedFinal = stakedStrings.filter((token) => token !== "0")
  console.log("stakedRaw", stakedRaw)
  console.log("stakedStrings", stakedStrings)
  console.log("stakedFinal", stakedFinal)
  const unstakedNfts = alchemyTokens.ownedNfts.filter((nft) => {
    const tokenId = parseInt(nft.id.tokenId, 16).toString()
    console.log("nft", tokenId)
      return !stakedFinal.includes(tokenId)
    },
  )
  console.log("unstakedNfts", unstakedNfts)

  return unstakedNfts
}

export default getUnstakedTracks
