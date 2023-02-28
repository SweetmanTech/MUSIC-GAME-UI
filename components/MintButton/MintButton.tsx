/* eslint-disable no-console */
import { ConnectButton } from "@rainbow-me/rainbowkit"
import Image from "next/image"
import { FC, useState } from "react"
import { useSigner } from "wagmi"
import axios from "axios"
import purchase from "../../lib/purchase"
import getEncodedPurchaseData from "../../lib/getEncodedPurchaseData"
import PopupModal from "../PopupModal"

interface MintButtonProps {
  choices?: string[]
  onSuccess: (metadata: any) => void
  audioTracksToMix: string[]
}

const MintButton: FC<MintButtonProps> = ({ onSuccess, audioTracksToMix }) => {
  const [mixing, setMixing] = useState<boolean>(false)
  const [isMinting, setIsMinting] = useState<boolean>(false)
  const { data: signer } = useSigner()

  const handleClick = async () => {
    if (!signer) return
    setMixing(true)
    const remixAndUploadResponse = await axios.post("/api/remix", {
      tracks: audioTracksToMix,
    })
    const { CID } = remixAndUploadResponse.data
    console.log("CID", CID)
    setMixing(false)
    setIsMinting(true)
    const initialData = getEncodedPurchaseData(CID)
    const receipt = await purchase(signer, initialData)
    if (!receipt.error) {
      const tokenId = receipt.events[0].args.tokenId.toString()
      onSuccess({
        image: "ipfs://bafkreiewdpza2o3tkehctw6xmk3hynktt4tcqeb6fsrqhmqxnnswi5svmm",
        name: `MUSIC GAME ${tokenId}`,
        tokenId,
        animationUrl: `ipfs://${CID}`,
      })
    }
    setIsMinting(false)
  }

  const className = `${mixing ? "bg-blue-500/50" : "bg-blue-500"} ${
    !mixing && "hover:bg-blue-700"
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
                <button type="button" onClick={handleClick} disabled={mixing} className={className}>
                  {mixing || isMinting ? (
                    <Image src="/spinner.gif" alt="spinner" width={50} height={50} />
                  ) : (
                    "Remix"
                  )}
                </button>
              )
            })()}
            {(mixing || isMinting) && <PopupModal open={mixing || isMinting} mixing={mixing} />}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}

export default MintButton
