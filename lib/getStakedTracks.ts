import { Contract } from "ethers"
import getProvider from "./getProvider"
import abi from "./abi-musicGame.json"
import getIpfsLink from "./getIpfsLink"
import { DecodedURI } from "../components/GameScreen/GameScreenTypes"

const getStakedTracks = async () => {
  const contract = new Contract(
    process.env.NEXT_PUBLIC_MUSIC_GAME_CONTRACT_ADDRESS,
    abi,
    getProvider(),
  )
  const tokens = await contract.cre8ingTokens()
  const uris = await contract.cre8ingURI()
  const tokensFiltered = tokens.filter((token: number) => token.toString() !== "0")
  const urisFiltered = uris.filter((uri: string) => uri !== "")
  const urisDecoded = urisFiltered.map((uri: string, index: number) => {
    const sub = uri.substring(uri.indexOf(",") + 1)
    const buff = Buffer.from(sub, "base64")
    const text = buff.toString("ascii")
    return { ...JSON.parse(text), tokenId: tokensFiltered[index] }
  })
  const newOptions = []
  urisDecoded.forEach((uri: DecodedURI) => {
    newOptions.push({
      id: uri.name,
      name: uri.name,
      imgUrl: getIpfsLink(uri.image),
      musicUrl: getIpfsLink(uri.animation_url),
    })
  })
  return newOptions
}

export default getStakedTracks
