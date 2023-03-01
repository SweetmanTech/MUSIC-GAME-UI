import axios from "axios"

const getNfts = async (owner: string, contractAddress: string) => {
  const alchemyKey = "ezyXM9BT43gERc4t37pvrR29sDYX81Ph"
  const { data } = await axios.get(
    `https://eth-goerli.g.alchemy.com/nft/v2/${alchemyKey}/getNFTs?owner=${owner}&contractAddresses%5B%5D=${contractAddress}`,
  )
  return data
}

export default getNfts
