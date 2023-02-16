import type { NextPage } from "next"
import { useState } from "react"
import dynamic from "next/dynamic"
import SeoHead from "../components/SeoHead"
import LaunchPage from "../components/LaunchPage"
import Results from "../components/Results"

const GameScreen = dynamic(() => import("../components/GameScreen"), { ssr: false })

const Home: NextPage = () => {
  const [entered, setEntered] = useState(false)
  const [minted, setMinted] = useState(true)

  return (
    <div className="bg-[#010e17] text-white">
      <SeoHead title="Music Game" description="Music Game coming soon" image="" />

      {!entered && <LaunchPage onClick={setEntered} />}
      {entered && !minted && <GameScreen />}
      {minted && <Results />}
    </div>
  )
}

export default Home
