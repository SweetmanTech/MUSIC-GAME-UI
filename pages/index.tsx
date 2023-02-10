import type { NextPage } from "next"
import { useState } from "react"
import SeoHead from "../components/SeoHead"
import LaunchPage from "../components/LaunchPage"
import RoadmapPage from "../components/RoadmapPage"

const Home: NextPage = () => {
  const [entered, setEntered] = useState(false)

  return (
    <div className="bg-[#010e17] text-white">
      <SeoHead title="CRE8ORS" description="CRE8ORS coming soon" image="" />

      {entered ? <RoadmapPage /> : <LaunchPage onClick={setEntered} />}
    </div>
  )
}

export default Home
