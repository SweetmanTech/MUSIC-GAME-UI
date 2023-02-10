import axios from "axios"
import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { toast } from "react-toastify"
import { AllowListScreens, RoadmapScreens } from "../lib/enums"
import Cre8orsContext from "./Crea8orsContext"

export const useCre8orsProvider = () => useContext(Cre8orsContext)

export const Cre8orsProvider = ({ children }) => {
  const [creatorType, setCreatorType] = useState("")
  const [whyCre8or, setWhyCre8or] = useState("")
  const [signedUp, setSignedUp] = useState(false)
  const [quizId, setQuizId] = useState("")
  const [showQuiz, setShowQuiz] = useState(!quizId.length)
  const [twitterHandle, setTwitterHandle] = useState<string>("")
  const [walletAddress, setWalletAddress] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [tokenId, setTokenId] = useState<string>("")
  const [txHash, setTxHash] = useState<string>("")
  const [haveTokenId, setHaveTokenId] = useState(false)
  const [timestamp, setTimeStamp] = useState<string>("")
  const [showSkeleton, setShowSkeleton] = useState(false)
  const [cre8orTypes, setCre8orTypes] = useState<Array<{ title: string; description: string }>>([])
  const [allowListScreen, setAllowListScreen] = useState(AllowListScreens.AllowListChoice)
  const [roadMapScreen, setRoadMapScreen] = useState(RoadmapScreens.Roadmap)

  const checkTx = useCallback(async () => {
    const response = await axios.get("/api/getTxLogs", {
      params: {
        txHash,
        chainId: process.env.NEXT_PUBLIC_ALLOW_LIST_CHAIN_ID,
      },
    })
    if (response) {
      setTokenId(parseInt(response.data.logs[0].topics[3], 16).toString())
      setHaveTokenId(true)
    }
  }, [txHash])

  const getCre8orTypes = useCallback(async () => {
    const response = await axios.get("/api/allowlist/typeform/getFormInfo")
    setCre8orTypes(response.data)
  }, [])
  const mint = useCallback(async () => {
    const reciept = await axios.post(
      "/api/allowlist/mint",
      {
        walletAddress,
        twitterHandle,
        reason: whyCre8or,
        creatorType,
        currentResponseId: quizId,
        timestamp,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_ALLOWLIST_API_KEY}`,
        },
      },
    )
    return reciept
  }, [creatorType, walletAddress, twitterHandle, whyCre8or, timestamp, quizId])

  const handleQuizSubmission = useCallback(async ({ responseId }) => {
    try {
      setQuizId(responseId)
      setAllowListScreen(AllowListScreens.Details)
      setShowQuiz(false)
      setShowSkeleton(true)
    } catch (e) {
      throw new Error(e)
    }
  }, [])

  const handleSignUp = useCallback(async () => {
    setLoading(true)
    try {
      const receipt = await mint()
      if (receipt?.data?.txReceipt) {
        setTxHash(receipt.data.txReceipt)
      }
      if (receipt.status === 200) {
        setSignedUp(true)
        toast.success("Registered successfully!")
        setTimeout(() => {
          setSignedUp(false)
          setQuizId("")
          setCreatorType("")
          setShowQuiz(true)
        }, 5000)
        setLoading(false)
      }
      setLoading(false)
    } catch (e) {
      toast.error("Registration failed")
      setLoading(false)
    }
  }, [mint])

  const fetchQuizResponse = useCallback(async () => {
    const quizData = await axios.get("/api/allowlist/typeform", {
      params: { responseId: quizId },
    })
    setTimeStamp(quizData.data.submitted_at)
    if (quizData?.data?.outcome?.title) {
      setCreatorType(quizData.data.outcome.title)
      setShowSkeleton(false)
    }
  }, [quizId])

  const updateRecordWithTokenID = useCallback(async () => {
    const response = await axios.post(
      "/api/allowlist/tokenID",
      {
        walletAddress,
        tokenID: tokenId,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_ALLOWLIST_API_KEY}`,
        },
      },
    )
    setTwitterHandle("")
    setWhyCre8or("")
    setWalletAddress("")
    setTokenId("")
    setHaveTokenId(false)
    return response
  }, [tokenId, walletAddress])

  useEffect(() => {
    let timeout = null
    if (quizId.length && !creatorType) {
      timeout = setTimeout(() => {
        fetchQuizResponse()
      }, 2000)
    }
    return () => timeout && clearTimeout(timeout)
  }, [quizId, fetchQuizResponse, creatorType])

  useEffect(() => {
    let timeout = null
    if (txHash.length > 0 && !haveTokenId) {
      timeout = setTimeout(() => {
        checkTx()
      }, 5000)
    }
    return () => timeout && clearTimeout(timeout)
  }, [txHash, haveTokenId, checkTx])

  useEffect(() => {
    if (haveTokenId && tokenId.length > 0 && walletAddress.length > 0) {
      updateRecordWithTokenID()
    }
  }, [haveTokenId, tokenId, updateRecordWithTokenID, walletAddress])

  useEffect(() => {
    getCre8orTypes()
  }, [getCre8orTypes, cre8orTypes])
  const value = useMemo(
    () => ({
      twitterHandle,
      setTwitterHandle,
      walletAddress,
      setWalletAddress,
      loading,
      setLoading,
      signedUp,
      setSignedUp,
      creatorType,
      setCreatorType,
      whyCre8or,
      setWhyCre8or,
      tokenId,
      setTokenId,
      haveTokenId,
      quizId,
      setQuizId,
      showQuiz,
      handleSignUp,
      handleQuizSubmission,
      showSkeleton,
      cre8orTypes,
      allowListScreen,
      setAllowListScreen,
      roadMapScreen,
      setRoadMapScreen,
    }),
    [
      twitterHandle,
      setTwitterHandle,
      walletAddress,
      setWalletAddress,
      loading,
      setLoading,
      tokenId,
      creatorType,
      setCreatorType,
      whyCre8or,
      setWhyCre8or,
      quizId,
      setQuizId,
      showQuiz,
      haveTokenId,
      handleSignUp,
      signedUp,
      setSignedUp,
      handleQuizSubmission,
      showSkeleton,
      cre8orTypes,
      allowListScreen,
      setAllowListScreen,
      roadMapScreen,
      setRoadMapScreen,
    ],
  )
  return <Cre8orsContext.Provider value={value}>{children}</Cre8orsContext.Provider>
}
