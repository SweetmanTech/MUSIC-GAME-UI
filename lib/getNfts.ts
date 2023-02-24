import axios from "axios";

const getNfts = async() => {
  const alchemyKey = "ezyXM9BT43gERc4t37pvrR29sDYX81Ph"
  const {data} = await axios.get(
    `https://eth-goerli.g.alchemy.com/nft/v2/${alchemyKey}/getNFTs?owner=0xcfBf34d385EA2d5Eb947063b67eA226dcDA3DC38&contractAddresses%5B%5D=0x93350fAEa6dC6B1486d7313b44cA9Eac1927B2C4`
  )
  console.log("data", data)
  return data
}

export default getNfts;