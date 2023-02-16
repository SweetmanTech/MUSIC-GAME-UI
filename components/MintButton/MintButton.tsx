import { ConnectButton } from "@rainbow-me/rainbowkit"
import Image from "next/image"
import { FC, useState } from "react"
import { useSigner } from "wagmi"
import Confetti from "react-confetti"
import { NFTStorage } from "nft.storage"
import Crunker from "crunker"
import _ from "lodash"
import purchase from "../../lib/purchase"
import useWindowSize from "../../lib/useWindowSize"
import getEncodedPurchaseData from "../../lib/getEncodedPurchaseData"
import PopupModal from "../PopupModal"

interface MintButtonProps {
  choices?: string[]
  onSuccess: Function
}

const client = new NFTStorage({
  token: `${process?.env?.NEXT_PUBLIC_NFT_STORAGE_TOKEN}`,
})
const MUSIC_URLS = {
  drums: [
    "https://defient-music.s3.amazonaws.com/90_DRUMS_HIPHOP_001-SWEETS.wav",
    "https://defient-music.s3.amazonaws.com/120_DRUMS_RNB_001-KATEE.wav",
    "https://defient-music.s3.amazonaws.com/120_DRUMS_RNB_002-JOE.wav",
  ],
  vocal: [
    "https://defient-music.s3.amazonaws.com/120_MUSIC_Bbmin_RNB_002-MCKENNA.wav",
    "https://defient-music.s3.amazonaws.com/120_MISC_RNB_001-JEFF.wav",
    "https://defient-music.s3.amazonaws.com/120_MUSIC_Bbmin_RNB_001-SERENA.wav",
  ],
  bass: [
    "https://defient-music.s3.amazonaws.com/120_MUSIC_Bbmin_RNB_002-MCKENNA.wav",
    "https://defient-music.s3.amazonaws.com/90_DRUMS_HIPHOP_002-SAMEER.wav",
    "https://defient-music.s3.amazonaws.com/90_DRUMS_TRAP_001-MARION.wav",
  ],
  guitar: [
    "https://defient-music.s3.amazonaws.com/90_MISC_HIPHOP_001-SHANE.wav",
    "https://defient-music.s3.amazonaws.com/90_MUSIC_Bbmin_HIPHOP_001-MICHAEL.wav",
    "https://defient-music.s3.amazonaws.com/90_MUSIC_Bbmin_HIPHOP_002-DOM.wav",
  ],
}

const MintButton: FC<MintButtonProps> = ({ onSuccess, choices }) => {
  const [loading, setLoading] = useState(false)
  const [startConfetti, setStartConfetti] = useState(false)
  const [mixing, setMixing] = useState<boolean>(false)
  const { data: signer } = useSigner()

  const handleClick = async () => {
    if (!signer) return
    setLoading(true)
    setMixing(true)
    const crunker = new Crunker()
    const buffers = await crunker.fetchAudio(
      _.sample(MUSIC_URLS[choices[0]]),
      _.sample(MUSIC_URLS[choices[1]]),
    )
    const merged = await crunker.mergeAudio(buffers)
    const output = await crunker.export(merged, "audio/wav")
    const CID = await client.storeBlob(output.blob)
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
      setStartConfetti(true)
      setTimeout(() => {
        setStartConfetti(false)
      }, 5000)
    }
    setLoading(false)
    setMixing(false)
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
                    "Remix"
                  )}
                </button>
              )
            })()}
            {mixing && <PopupModal open={mixing} />}
          </div>
        )
      }}
    </ConnectButton.Custom>
  )
}

export default MintButton
