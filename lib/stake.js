import { toast } from "react-toastify"
import handleTxError from "./handleTxError"

export const stake = async (contract, tokenId, nftContract, onSuccess, setPendingTxStep) => {
  try {
    setPendingTxStep(1) // APPROVING
    setPendingTxStep(2) // STAKING
    const tx = await contract.toggleCre8ing([tokenId])
    await tx.wait()
    toast.success("Staked!")
    return onSuccess()
  } catch (error) {
    handleTxError(error)
    return { error }
  }
}

export const unstake = async (contract, tokenId, onSuccess, setPendingTxStep) => {
  try {
    setPendingTxStep(3) // SIGNING UNSTAKE
    const tx = await contract.toggleCre8ing([tokenId])
    setPendingTxStep(4) // UNSTAKING
    await tx.wait()
    toast.success("Unstaked!")
    await onSuccess()
  } catch (error) {
    handleTxError(error)
  }
}
