import { Contract } from "ethers"
import getProvider from "./getProvider"
import abi from "./abi-musicGame.json"
import getNfts from "./getNfts"

const getUnstakedTracks = async (address: string) => {
  const contractAddress = process.env.NEXT_PUBLIC_MUSIC_GAME_CONTRACT_ADDRESS
  const contract = new Contract(contractAddress, abi, getProvider())
  const alchemyTokens = await getNfts(address, contractAddress)
  const stakedRaw = await contract.cre8ingTokens()
  const stakedStrings = stakedRaw.map((token) => token.toString())
  const stakedFinal = stakedStrings.filter((token) => token !== "0")
  const unstakedNfts = alchemyTokens.ownedNfts.filter((nft) => {
    const tokenId = parseInt(nft.id.tokenId, 16).toString()
    return !stakedFinal.includes(tokenId)
  })

  return unstakedNfts
}

export default getUnstakedTracks
