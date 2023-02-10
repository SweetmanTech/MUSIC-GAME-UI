import React from "react"
import { motion } from "framer-motion"
import { AllowListScreens } from "../../lib/enums"
import { useCre8orsProvider } from "../../providers/Crea8orsProvider"

const PickCre8orType: React.FC = () => {
  const { cre8orTypes, setCreatorType, setAllowListScreen } = useCre8orsProvider()

  return (
    cre8orTypes?.length && (
      <motion.div
        initial={{ opacity: 0, x: "-100vh" }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ type: "spring", duration: 1 }}
      >
        <div className="justify-center min-h-full text-center align-middle">
          <div className="grid gap-2 lg:grid-cols-4 md:grid-cols-2 gap-y-4">
            {cre8orTypes.map((cre8orType) => (
              <motion.div
                key={cre8orType.title}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.8 }}
              >
                <button
                  type="button"
                  className="max-w-xs h-[35vh] mx-4 mb-2 bg-white rounded-lg shadow-lg cursor-pointer"
                  onClick={() => {
                    setCreatorType(cre8orType.title)
                    setAllowListScreen(AllowListScreens.Details)
                  }}
                >
                  <div className="px-6 py-4">
                    <h4 className="mb-2 text-xl font-semibold tracking-tight text-gray-800">
                      {cre8orType.title}
                    </h4>
                    <p className="leading-normal text-gray-700">{cre8orType.description}</p>
                  </div>
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    )
  )
}

export default PickCre8orType
