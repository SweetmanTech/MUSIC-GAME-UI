import { useEffect, useState } from "react"
import { Contract, ethers } from "ethers"
import Image from "next/image"
import abi from "../../lib/abi-musicGame.json"
import getIpfsLink from "../../lib/getIpfsLink"

const GeneratedMusic = ({ checked, choices, playAudio, musicUrl, onClickHandler }: any) => {
  const [trackMetadata, setTrackMetadata] = useState([])

  const getProvider = () => {
    const goerliRpc = "https://ethereum-goerli-rpc.allthatnode.com"
    const provider = ethers.getDefaultProvider(goerliRpc)
    return provider
  }

  useEffect(() => {
    const init = async () => {
      const contract = new Contract(
        process.env.NEXT_PUBLIC_MUSIC_GAME_CONTRACT_ADDRESS,
        abi,
        getProvider(),
      )
      const tokens = await contract.cre8ingTokens()
      const uris = await contract.cre8ingURI()
      console.log("tokens", tokens)
      console.log("uris", uris)

      const tokensFiltered = tokens.filter((token) => token.toString() !== "0")
      const urisFiltered = uris.filter((uri) => uri !== "")
      console.log("tokensFiltered", tokensFiltered)
      console.log("urisFiltered", urisFiltered)

      const urisDecoded = urisFiltered.map((uri, index) => {
        console.log("uri", uri)
        const sub = uri.substring(uri.indexOf(",") + 1)
        console.log("sub", sub)

        return { ...JSON.parse(window.atob(sub)), tokenId: tokensFiltered[index] }
      })
      console.log("urisDecoded", urisDecoded)
      setTrackMetadata(urisDecoded)
    }

    init()
  }, [])

  return (
    <div className="flex grid grid-cols-4">
      {trackMetadata.map((option) => (
        <div key={option.name}>
          <button
            key={option.id}
            type="button"
            className={`p-4 m-2 ${
              checked[option.name] ? `border-green-500` : "border-white-500"
            }  ${checked[option.name] ? "border-4" : "border-4"} rounded-full disabled:opacity-25`}
            onClick={() => onClickHandler(option)}
            disabled={choices.length === 2 && !choices.includes(option.name)}
          >
            <Image src={getIpfsLink(option.image)} alt={option.name} width={100} height={100} />
          </button>
        </div>
      ))}
    </div>
  )
}

export default GeneratedMusic
