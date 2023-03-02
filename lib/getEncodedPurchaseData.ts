import { AbiCoder } from "ethers/lib/utils.js"

const getEncodedPurchaseData = (cid: string, tokenIds: number[]) => {
  const abiCoder = new AbiCoder()

  const initialData = abiCoder.encode(
    ["string", "string", "string", "uint256[]"],
    [
      "Music Game by the CRE8ORS",
      `ipfs://bafkreiewdpza2o3tkehctw6xmk3hynktt4tcqeb6fsrqhmqxnnswi5svmm`,
      `ipfs://${cid}`,
      tokenIds,
    ],
  )
  return initialData
}

export default getEncodedPurchaseData
