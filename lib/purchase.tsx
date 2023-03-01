import { ethers, Signer } from "ethers"

import handleTxError from "./handleTxError"
import abi from "./abi-musicGame.json"

const purchase = async (signer: Signer, initialData?: string) => {
  const contractAddress = process.env.NEXT_PUBLIC_MUSIC_GAME_CONTRACT_ADDRESS

  const contract = new ethers.Contract(contractAddress, abi, signer)
  try {
    const salesInfo = await contract.salesConfig()
    const priceInWei = salesInfo.publicSalePrice.toString()
    const tx = await contract.purchase(1, initialData, {
      value: priceInWei,
    })
    const receipt = await tx.wait()
    return receipt
  } catch (err) {
    handleTxError(err)
    return { error: err }
  }
}

export default purchase
