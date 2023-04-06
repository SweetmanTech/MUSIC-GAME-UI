import { Contract } from "ethers"
import getProvider from "./getProvider"
import abi from "./abi-musicGame.json"
import getIpfsLink from "./getIpfsLink"
import { DecodedURI } from "../components/GameScreen/GameScreenTypes"

const getURI = async (tokenIDs: number[]) => {
  const contract = new Contract(
    process.env.NEXT_PUBLIC_MUSIC_GAME_CONTRACT_ADDRESS,
    abi,
    getProvider(),
  )
  const uris = []
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < tokenIDs.length; i++) {
    // eslint-disable-next-line no-await-in-loop
    const uri = await contract.tokenURI(tokenIDs[i])
    uris.push(uri)
  }
  const urisDecoded = uris.map((uri: string, index: number) => {
    const sub = uri.substring(uri.indexOf(",") + 1)
    const buff = Buffer.from(sub, "base64")
    const text = buff.toString("ascii")
    return { ...JSON.parse(text), tokenId: uris[index] }
  })
  const newOptions = []
  urisDecoded.forEach((uri: DecodedURI, index: number) => {
    newOptions.push({
      id: { tokenId: tokenIDs[index] },
      metadata: {
        name: uri.name,
        image: getIpfsLink(uri.image),
        animation_url: getIpfsLink(uri.animation_url),
      },
    })
  })
  return newOptions
}

export default getURI
