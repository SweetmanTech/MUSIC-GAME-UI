import { ConnectButton } from "@rainbow-me/rainbowkit"
import Image from "next/image"
import { FC, useState } from "react"
import { useSigner } from "wagmi"
import Confetti from "react-confetti"
import { useRouter } from "next/router"
import { AbiCoder } from "ethers/lib/utils.js"
import purchase from "../../lib/purchase"
import useWindowSize from "../../lib/useWindowSize"

interface MintButtonProps {
  cid?: string
  resetFormResponse?: (value: string) => void
}
const MintButton: FC<MintButtonProps> = ({ cid }) => {
  const [loading, setLoading] = useState(false)
  const [startConfetti, setStartConfetti] = useState(false)
  const { data: signer } = useSigner()
  const { width, height } = useWindowSize()
  console.log("cid", cid)
  const router = useRouter()

  const handleClick = async () => {
    if (!signer) return
    setLoading(true)
    const abiCoder = new AbiCoder()
    const initialData = abiCoder.encode(
      ["string", "string", "string"],
      [
        "Music Game by the CRE8ORS",
        `ipfs://bafkreie7jnfyuomzbuqlaqvmkpu5thmuuuznbuxttlaw6axx3dx54pbtya`,
        `ipfs://${cid}`,
      ],
    )
    console.log("initialData", initialData)
    const receipt = await purchase(signer, initialData)
    if (!receipt.error) {
      setStartConfetti(true)
      setTimeout(() => {
        console.log("receipt", receipt)
        setStartConfetti(false)
        const tokenId = receipt.events[0].args.tokenId.toString()
        console.log("receipt has tokenId?", tokenId)
        router.push(
          `https://testnets.opensea.io/assets/goerli/${process.env.NEXT_PUBLIC_MUSIC_GAME_CONTRACT_ADDRESS}/${tokenId}`,
        )
      }, 5000)
    }
    setLoading(false)
  }

  const className = `${loading ? "bg-blue-500/50" : "bg-blue-500"} ${
    !loading && "hover:bg-blue-700"
  } text-white font-bold py-2 px-4 rounded`
  return (
    <ConnectButton.Custom>
      {({ account, chain, openChainModal, openConnectModal, mounted }) => {
        const ready = mounted
        const connected = ready && account && chain

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button onClick={openConnectModal} type="button" className={className}>
                    Connect Wallet
                  </button>
                )
              }

              if (chain.id !== Number(process.env.NEXT_PUBLIC_CHAIN_ID)) {
                return (
                  <button onClick={openChainModal} type="button" className={className}>
                    Wrong network
                  </button>
                )
              }

              return (
                <button
                  type="button"
                  onClick={handleClick}
                  disabled={loading}
                  className={className}
                >
                  {loading ? (
                    <Image src="/spinner.gif" alt="spinner" width={50} height={50} />
                  ) : (
                    "Mint"
                  )}
                </button>
              )
            })()}
            {startConfetti && <Confetti width={width} height={height} />}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}

export default MintButton
