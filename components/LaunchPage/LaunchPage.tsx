import Image from "next/image"

const LaunchPage = (props: any) => {
  const { onClick } = props

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-3">
      <Image src="/logo.png" height="100" width="150" alt="logo" />
      <div>CRE8ORS x ChillRx</div>
      <button
        type="button"
        onClick={onClick}
        className="bg-[#be0e11] text-white font-bold py-2 px-4 rounded-full hover:bg-white hover:text-[#be0e11]"
      >
        enter
      </button>
    </div>
  )
}

export default LaunchPage
