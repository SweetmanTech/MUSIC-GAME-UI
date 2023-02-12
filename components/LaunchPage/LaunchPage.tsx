import Image from "next/image"

const LaunchPage = (props: any) => {
  const { onClick } = props

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-10">
      <Image
        src="/musicGameLogo.png"
        height="100"
        width="100"
        alt="logo"
        className="rounded-full p-3"
      />
      <div className="text-8xl">MUSIC GAME</div>
      <button
        type="button"
        onClick={onClick}
        className="bg-[#be0e11] text-white text-xl font-bold py-4 px-8 rounded-full hover:bg-white hover:text-[#be0e11]"
      >
        enter
      </button>
    </div>
  )
}

export default LaunchPage
