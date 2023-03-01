import { useEffect, useState } from "react"
import { allChains, useAccount, useNetwork, useSigner } from "wagmi"
import { Contract, ethers } from "ethers"
import { useRouter } from "next/router"
import TokenRow from "../SVG/TokenRow"
import getIpfsLink from "../../lib/getIpfsLink"
import abi from "../../lib/abi-musicGame.json"
import getNfts from "../../lib/getNfts"

const MainPage = ({ setPendingTxStep }) => {
  const { data: signer } = useSigner()
  const { address: account } = useAccount()
  const { chain: activeChain } = useNetwork()
  const router = useRouter()
  const { address: owner } = router.query
  const chainId = process.env.NEXT_PUBLIC_CHAIN_ID
  const address = process.env.NEXT_PUBLIC_MUSIC_GAME_CONTRACT_ADDRESS
  const chain = allChains.find((c) => c.id === Number(chainId))
  const [nftContract, setNftContract] = useState("" as any)
  const [tokens, setTokens] = useState([])
  const [stakedTokens, setStakedTokens] = useState([])

  const load = async (signerOrProvider) => {
    if (account) {
      const alchemyTokens = await getNfts(owner as string, address)
      const contract = new Contract(
        process.env.NEXT_PUBLIC_MUSIC_GAME_CONTRACT_ADDRESS,
        abi,
        signerOrProvider,
      )
      setNftContract(contract)
      const stakedRaw = await contract.cre8ingTokens()
      const stakedStrings = stakedRaw.map((token) => token.toString())
      const stakedFinal = stakedStrings.filter((token) => token !== "0")
      setStakedTokens(stakedFinal)
      setTokens(alchemyTokens.ownedNfts)
    }
  }

  const getSignerOrProvider = () => {
    const goerliRpc = "https://ethereum-goerli-rpc.allthatnode.com"
    const isCorrectNetwork = chain.id === activeChain.id
    const provider = chain.id === 1 ? { chainId: chain.id } : ethers.getDefaultProvider(goerliRpc)
    return isCorrectNetwork ? signer : provider
  }

  useEffect(() => {
    if (!chainId) return

    if (!signer) return
    load(getSignerOrProvider())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, chain, chainId, signer])

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap flex flex-col sm:flex-row items-center">
        {tokens.length > 0 &&
          tokens.map((token) => {
            const myTokenId = parseInt(token.id.tokenId, 16)
            const imgHash = token.metadata.image
            const isInvalid = imgHash.includes("imgUri") || imgHash.includes("Hello World")
            const imageUrl = isInvalid ? "" : getIpfsLink(imgHash)
            const isStaked = stakedTokens.includes(myTokenId.toString())
            return (
              <TokenRow
                key={myTokenId}
                nftContract={nftContract}
                staked={isStaked}
                tokenId={myTokenId}
                image={imageUrl}
                onSuccess={() => {
                  load(signer)
                  setPendingTxStep(0)
                }}
                className="w-[75vw] sm:w-[30vw]"
                setPendingTxStep={setPendingTxStep}
              />
            )
          })}
      </div>
    </div>
  )
}

export default MainPage
