import { FC } from "react"
import { useCre8orsProvider } from "../../providers/Crea8orsProvider"
import TextArea from "../TextArea"

const AllowListForm: FC = () => {
  const {
    walletAddress,
    setWalletAddress,
    twitterHandle,
    setTwitterHandle,
    whyCre8or,
    setWhyCre8or,
    creatorType,
    handleSignUp,
    loading,
  } = useCre8orsProvider()
  const displayBorder = (value: string) => !value?.length && "border-red-500"
  const displayRequiredText = (value: string, message: string) =>
    !value?.length && <p className="text-xs italic text-red-500">{message}</p>
  const disabled = !walletAddress?.length || !twitterHandle?.length || !whyCre8or?.length
  return (
    <div className="w-full max-w-xl">
      <form
        className={`px-8 pt-6 pb-8 mb-4 bg-white rounded shadow-md ${loading && "animate-pulse"}`}
      >
        <div className="mb-4">
          <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="username">
            Wallet Address
          </label>
          <input
            className={`w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline ${displayBorder(
              walletAddress,
            )}`}
            id="walletAddress"
            type="text"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            placeholder="wallet address"
          />
          {displayRequiredText(walletAddress, "Please enter a wallet address.")}
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="password">
            Twitter Handle
          </label>
          <input
            className={`w-full px-3 py-2 mb-3 leading-tight text-gray-700 border ${displayBorder(
              twitterHandle,
            )} rounded shadow appearance-none focus:outline-none focus:shadow-outline`}
            id="twitterHandle"
            type="text"
            value={twitterHandle}
            onChange={(e) => setTwitterHandle(e.target.value)}
            placeholder="@cre8ors"
          />
          {displayRequiredText(twitterHandle, "Please enter a twitter handle.")}
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="password">
            What type of cre8or are you?
          </label>
          <input
            className={`w-full px-3 py-2 mb-3 leading-tight text-gray-700 border ${displayBorder(
              creatorType,
            )} rounded shadow appearance-none focus:outline-none focus:shadow-outline`}
            id="creatorType"
            type="text"
            value={creatorType}
            readOnly
            placeholder="artist, musician, etc."
          />
        </div>
        <div className="mb-6">
          <TextArea
            value={whyCre8or}
            setValue={setWhyCre8or}
            label="Why do you want to be a cre8or?"
          />
          {displayRequiredText(whyCre8or, "Please enter a reason for wanting to be a cre8or.")}
        </div>
        <div className="flex items-center justify-between">
          <button
            className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 focus:outline-none focus:shadow-outline disabled:opacity-25 disabled:cursor-not-allowed"
            type="button"
            onClick={handleSignUp}
            disabled={disabled || loading}
          >
            Sign Up
          </button>
        </div>
      </form>
      <p className="text-xs text-center text-gray-500">&copy;2022 CRE8ORS. All rights reserved.</p>
    </div>
  )
}

export default AllowListForm
