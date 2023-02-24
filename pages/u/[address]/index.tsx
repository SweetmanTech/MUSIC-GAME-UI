import type { NextPage } from "next"
import { useState } from "react"
import SeoHead from "../../../components/SeoHead"
import LaunchPage from "../../../components/LaunchPage"
import StakingPage from "../../../components/StakingPage"

const Home: NextPage = () => {
  const [entered, setEntered] = useState(false)

  return (
    <div className="bg-[#010e17] text-white">
      <SeoHead title="Music Game" description="Music Game coming soon" image="" />

      {!entered && <LaunchPage onClick={setEntered} />}
      {entered && <StakingPage />}
    </div>
  )
}

export default Home
