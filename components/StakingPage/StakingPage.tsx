import { useState } from "react"
import TxModal from "../TxModals"
import MainPage from "./MainPage"

const StakingPage = () => {
  const [pendingTxStep, setPendingTxStep] = useState(0)

  const isPendingTx = pendingTxStep > 0
  return isPendingTx ? (
    <TxModal
      stepOnePassed={pendingTxStep > 1}
      stepTwoPassed={pendingTxStep === 0}
      textOne="APPROVING PILLS"
      textTwo="STAKING PILLS"
      translateOne={326.75}
      translateTwo={376.86}
      style={{ width: "50vw" }}
    />
  ) : (
    <MainPage setPendingTxStep={setPendingTxStep} />
  )
}

export default StakingPage
