import { ConnectButton } from "@rainbow-me/rainbowkit"
import Button from "../Button"

const SignInButton = () => (
  <ConnectButton.Custom>
    {({ openConnectModal, mounted }) => {
      const ready = mounted

      return (
        <div
          {...(!ready && {
            "aria-hidden": true,
            style: {
              opacity: 0,
              pointerEvents: "none",
              userSelect: "none",
            },
          })}
        >
          <Button onClick={openConnectModal} type="button">
            Sign In
          </Button>
        </div>
      )
    }}
  </ConnectButton.Custom>
)

export default SignInButton
