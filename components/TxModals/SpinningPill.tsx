import Image from "next/image"

const SpinningPill = () => (
  <div className="absolute top-[51vh] sm:top-[44vh] left-[38vw] h-[100px] sm:h-330px w-[100px] sm:w-[330px]">
    <Image src="/spinner.gif" layout="fill" objectFit="cover" alt="chillrx" />
  </div>
)

export default SpinningPill
