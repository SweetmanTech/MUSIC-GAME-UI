import { AbiCoder } from "ethers/lib/utils.js"

const getEncodedPurchaseData = (cid: string) => {
  const abiCoder = new AbiCoder()

  const initialData = abiCoder.encode(
    ["string", "string", "string"],
    [
      "Music Game by the CRE8ORS",
      `ipfs://bafkreiewdpza2o3tkehctw6xmk3hynktt4tcqeb6fsrqhmqxnnswi5svmm`,
      `ipfs://${cid}`,
    ],
  )
  return initialData
}

export default getEncodedPurchaseData
