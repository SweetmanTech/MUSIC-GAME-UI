import { ethers } from "ethers"

const getProvider = () => {
  const provider = ethers.getDefaultProvider(process.env.NEXT_PUBLIC_RPC_URL)
  return provider
}

export default getProvider
