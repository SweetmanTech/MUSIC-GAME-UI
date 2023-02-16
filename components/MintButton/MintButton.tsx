import { ConnectButton } from "@rainbow-me/rainbowkit"
import Image from "next/image"
import { FC, useState } from "react"
import { useSigner } from "wagmi"
import Confetti from "react-confetti"
import purchase from "../../lib/purchase"
import useWindowSize from "../../lib/useWindowSize"
import getEncodedPurchaseData from "../../lib/getEncodedPurchaseData"

interface MintButtonProps {
  cid?: string
  onSuccess: Function
}

const MintButton: FC<MintButtonProps> = ({ cid, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const [startConfetti, setStartConfetti] = useState(false)
  const { data: signer } = useSigner()
  const { width, height } = useWindowSize()

  const handleClick = async () => {
    if (!signer) return
    setLoading(true)
    const initialData = getEncodedPurchaseData(cid)
    const receipt = await purchase(signer, initialData)
    if (!receipt.error) {
      const tokenId = receipt.events[0].args.tokenId.toString()
      onSuccess({
        image: "ipfs://bafkreiewdpza2o3tkehctw6xmk3hynktt4tcqeb6fsrqhmqxnnswi5svmm",
        name: `MUSIC GAME ${tokenId}`,
        tokenId,
        animationUrl: `ipfs://${cid}`,
      })
      setStartConfetti(true)
      setTimeout(() => {
        setStartConfetti(false)
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
