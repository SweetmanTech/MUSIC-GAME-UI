import { ethers, Signer } from "ethers"
import abi from "./abi-cre8ors.json"

const balanceOf = async (signer: Signer) => {
  const contract = new ethers.Contract(process.env.NEXT_PUBLIC_CRE8ORS_ADDRESS, abi, signer)
  const address = await signer.getAddress()

  try {
    const response = await contract.balanceOf(address)
    return response
  } catch (err) {
    return { error: err }
  }
}

export default balanceOf
