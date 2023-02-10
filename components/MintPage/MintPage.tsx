import MintButton from "../MintButton"
import abi from "../../lib/abi-cre8ors.json"

function MintPage() {
  const contractAddress = String(process.env.NEXT_PUBLIC_CRE8ORS_ADDRESS)
  return (
    <div className="flex flex-col items-center justify-around text-4xl pt-10 h-[75vh]">
      <div>Mint Page</div>
      <MintButton contractAddress={contractAddress} abi={abi} />
    </div>
  )
}

export default MintPage
