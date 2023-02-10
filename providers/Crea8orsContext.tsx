import { createContext, SetStateAction, Dispatch } from "react"

export interface Cre8orsContextInterface {
  twitterHandle?: string
  setTwitterHandle?: Dispatch<SetStateAction<string>>
  walletAddress?: string
  setWalletAddress?: Dispatch<SetStateAction<string>>
  loading: boolean
  setLoading?: Dispatch<SetStateAction<boolean>>
  whyCre8or?: string
  setWhyCre8or?: Dispatch<SetStateAction<string>>
  tokenId?: string
  creatorType?: string
  setCreatorType?: Dispatch<SetStateAction<string>>
  startConfetti?: boolean
  setStartConfetti?: Dispatch<SetStateAction<boolean>>
  haveTokenId?: boolean
  signedUp?: boolean
  setSignedUp?: Dispatch<SetStateAction<boolean>>
  quizId?: string
  setQuizId?: Dispatch<SetStateAction<string>>
  showQuiz?: boolean
  setShowQuiz?: Dispatch<SetStateAction<boolean>>
  handleSignUp?: () => void
  handleQuizSubmission?: ({ responseId }) => void
  showSkeleton?: boolean
  cre8orTypes?: Array<{ title: string; description: string }>
  roadMapScreen?: string
  setRoadMapScreen?: Dispatch<SetStateAction<string>>
  allowListScreen?: string
  setAllowListScreen?: Dispatch<SetStateAction<string>>
}
export const initialContext: Cre8orsContextInterface = {
  loading: false,
}
const Cre8orsContext = createContext<Cre8orsContextInterface>(initialContext)

export default Cre8orsContext
