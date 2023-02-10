import { RoadmapScreens } from "../../lib/enums"
import { useCre8orsProvider } from "../../providers/Crea8orsProvider"
import AllowList from "../AllowList"
import Roadmap from "../Roadmap"

const RoadmapPage = () => {
  const { roadMapScreen } = useCre8orsProvider()

  const displayScreen = () => {
    switch (roadMapScreen) {
      case RoadmapScreens.AllowListChoice:
        return <AllowList />
      default:
        return <Roadmap />
    }
  }
  return <div className="sm:h-screen h-[200vh]">{displayScreen()}</div>
}

export default RoadmapPage
