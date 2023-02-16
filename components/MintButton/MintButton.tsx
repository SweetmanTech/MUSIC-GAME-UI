import { ConnectButton } from "@rainbow-me/rainbowkit"
import Image from "next/image"
import { FC, useState } from "react"
import { useSigner } from "wagmi"
import { NFTStorage } from "nft.storage"
import Crunker from "crunker"
import _ from "lodash"
import purchase from "../../lib/purchase"
import getEncodedPurchaseData from "../../lib/getEncodedPurchaseData"
import PopupModal from "../PopupModal"
import { MUSIC_URLS } from "../../lib/consts"

interface MintButtonProps {
  choices?: string[]
  onSuccess: Function
}

const client = new NFTStorage({
  token: `${process?.env?.NEXT_PUBLIC_NFT_STORAGE_TOKEN}`,
})

const MintButton: FC<MintButtonProps> = ({ onSuccess, choices }) => {
  const [mixing, setMixing] = useState<boolean>(false)
  const { data: signer } = useSigner()

  const handleClick = async () => {
    if (!signer) return
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
    }
    setMixing(false)
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
                  {mixing ? (
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
