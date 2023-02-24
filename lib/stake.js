import { toast } from "react-toastify"
import handleTxError from "./handleTxError"

export const stakeAll = async (
  contract,
  nftContract,
  tokensToStake,
  address,
  onSuccess,
  setPendingTxStep,
) => {
  try {
    setPendingTxStep(1) // APPROVING

    setPendingTxStep(2) // STAKING
    const tx = await contract.stake(tokensToStake)
    await tx.wait()
    toast.success("Staked all tokens!")
    return onSuccess()
  } catch (error) {
    handleTxError(error)
    return { error }
  }
}

export const stake = async (contract, tokenId, nftContract, onSuccess, setPendingTxStep) => {
  try {
    console.log("contract", contract)
    setPendingTxStep(1) // APPROVING
    // const approved = await isPillStakeApproved(nftContract, address, contract)
    // if (!approved) {
    //   const nowApproved = await approve(nftContract, contract, tokenId)
    //   if (!nowApproved || nowApproved.error) {
    //     return nowApproved
    //   }
    // }
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

export const claim = async (contract, tokenIds, setPendingTxStep, onSuccess, switchNetwork) => {
  if (!contract.signer) {
    toast.error("please connect wallet & try again")
    await switchNetwork(Number(process.env.NEXT_PUBLIC_CHAIN_ID))
    return
  }
  setPendingTxStep(5) // SIGNING CLAIM
  try {
    const tx = await contract.claim(tokenIds)
    setPendingTxStep(6) // CLAIMING
    await tx.wait()
    toast.success("Claimed!")
    await onSuccess()
  } catch (error) {
    handleTxError(error)
  }
  setPendingTxStep(0)
}
