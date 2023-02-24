import { useEffect, useState } from "react"
import { allChains, useAccount, useNetwork, useSigner } from "wagmi"
import { Contract, ethers } from "ethers"
import { useRouter } from "next/router"
import SteakChatSvg from "../SVG/SteakChat"
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
  const [stakingContract, setStakingContract] = useState("" as any)
  const [nftContract, setNftContract] = useState("" as any)
  const [tokens, setTokens] = useState([])
  const [stakedTokens, setStakedTokens] = useState([])
  const [unstakedTokens, setUnstakedTokens] = useState([])

  const load = async (signerOrProvider) => {
    if (account) {
      const alchemyTokens = await getNfts(owner as string, address)
      console.log("alchemyTokens", alchemyTokens.ownedNfts)
      setUnstakedTokens(alchemyTokens.ownedNfts)
      const contract = new Contract(
        process.env.NEXT_PUBLIC_MUSIC_GAME_CONTRACT_ADDRESS,
        abi,
        signerOrProvider,
      )
      setNftContract(contract)
      // const stakedPills = await getStakedPills(contracts.staking)
      let stakedZdkTokens = []
      const stakedRaw = await contract.cre8ingTokens()
      const stakedStrings = stakedRaw.map((token) => token.toString())
      const stakedFinal = stakedStrings.filter((token) => token !== "0")
      console.log("stakedRaw", stakedRaw)
      console.log("stakedStrings", stakedStrings)
      console.log("stakedFinal", stakedFinal)
      setStakedTokens(stakedFinal)
      // if (stakedPills.length > 0) {
      //   stakedZdkTokens = await getStakedZdkTokens(stakedPills)
      // }
      setTokens([...alchemyTokens.ownedNfts, ...stakedZdkTokens])
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
  }, [address, chain, chainId, signer])

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-center">
        <SteakChatSvg
          amountOfChill="808"
          className="relative w-[90vw] sm:w-[50vw] left-[0vw] sm:left-[8vw] top-[0vh] sm:top-[-10vh]"
          chillTokenAddres="0x0000000000000000000000000000000000000000"
          setPendingTxStep={setPendingTxStep}
          tokensToStake={unstakedTokens}
          stakedTokenIds={stakedTokens}
          stakingContract={stakingContract}
          nftContract={nftContract}
          onSuccess={() => {
            load(signer)
            setPendingTxStep(0)
          }}
        />
      </div>

      <div className="flex flex-wrap flex flex-col sm:flex-row items-center">
        {tokens.length > 0 &&
          tokens.map((token) => {
            const myTokenId = parseInt(token.id.tokenId, 16)
            const imgHash = token.metadata.image
            const isInvalid = imgHash.includes("imgUri") || imgHash.includes("Hello World")
            const imageUrl = isInvalid ? "" : getIpfsLink(imgHash)
            const isStaked = stakedTokens.includes(myTokenId.toString())
            console.log("isStaked", isStaked)
            console.log("stakedTokens", stakedTokens)
            console.log("myTokenId", myTokenId)
            return (
              <TokenRow
                stakingContract={stakingContract}
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
