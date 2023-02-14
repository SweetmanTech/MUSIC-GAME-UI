import { AbiCoder } from "ethers/lib/utils.js"

const getEncodedPurchaseData = (cid: string) => {
  const abiCoder = new AbiCoder()

  const initialData = abiCoder.encode(
    ["string", "string", "string"],
    [
      "Music Game by the CRE8ORS",
      `ipfs://bafkreie7jnfyuomzbuqlaqvmkpu5thmuuuznbuxttlaw6axx3dx54pbtya`,
      `ipfs://${cid}`,
    ],
  )
  return initialData
}

export default getEncodedPurchaseData