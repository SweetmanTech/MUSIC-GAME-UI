/* eslint-disable react/button-has-type */
import { useEffect, useState } from "react"
import { useCre8orsProvider } from "../../providers/Crea8orsProvider"

const Roadmap = () => {
  const { setRoadMapScreen } = useCre8orsProvider()
  const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 })
  const className =
    "border cursor-pointer border-sky-500 h-[80vh] min-w-[100vw] sm:min-w-[30vw] rounded-2xl p-5 overflow-x-scroll snap-always snap-center"

  const RoadmapCards: Array<{ displayText: string; id: string; img?: string }> = [
    {
      displayText: "Watch Trailer",
      id: "trailer",
    },
    {
      displayText: "Mysteries Revealed",
      id: "mysteries",
    },
    {
      displayText: "Storyline",
      id: "story",
    },
    {
      displayText: "Play Whitelist Quiz",
      id: "allow-list-choice",
    },
    {
      displayText: "COMING SOON",
      id: "coming-soon1",
    },
    {
      displayText: "COMING SOON",
      id: "coming-soon2",
    },
    {
      displayText: "COMING SOON",
      id: "coming-soon3",
    },
  ]

  useEffect(() => {
    const handleScroll = (event) => {
      setScrollPosition({ x: window.scrollX + event.deltaY, y: window.scrollY })
    }
    window.addEventListener("wheel", handleScroll)
    return () => {
      window.removeEventListener("wheel", handleScroll)
    }
  }, [])

  useEffect(() => {
    window.scrollTo(scrollPosition.x, scrollPosition.y)
  }, [scrollPosition])

  return (
    <div className="sm:h-screen h-[200vh] w-[200vw] snap-x snap-mandatory flex nowrap items-center  gap-3 pl-[154vw] sm:pl-[50vw] overflow-x-auto">
      {RoadmapCards.map((item) => (
        <div
          key={item.id}
          className={className}
          onClick={() => {
            setRoadMapScreen(item.id)
          }}
          aria-hidden="true"
        >
          {item.displayText}
        </div>
      ))}
    </div>
  )
}

export default Roadmap
