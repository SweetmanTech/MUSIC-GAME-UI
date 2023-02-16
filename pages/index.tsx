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

  if (false) console.log(setMinted)

  return (
    <div className="bg-[#010e17] text-white">
      <SeoHead title="Music Game" description="Music Game coming soon" image="" />

      {!entered && <LaunchPage onClick={setEntered} />}
      {entered && !minted && <GameScreen />}
      {minted && (
        <Results
          metadata={{
            name: "MUSIC GAME 20/100000",
            description: "Music Game by the CRE8ORS",
            image: "ipfs://bafkreiewdpza2o3tkehctw6xmk3hynktt4tcqeb6fsrqhmqxnnswi5svmm",
            animation_url: "ipfs://bafybeib5n2bawajdvm5sh2mh7eoncxm3gpeyeuq6ksgysovd3ttrr3d3bm",
            properties: { number: 20, name: "MUSIC GAME" },
          }}
          tokenId={20}
        />
      )}
    </div>
  )
}

export default Home
