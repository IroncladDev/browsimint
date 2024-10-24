import { federations } from "@common/constants"
import gr from "@common/gradients"
import { FederationItemSchema, LocalStore } from "@common/storage"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { useCallback, useEffect, useState } from "react"
import colors from "tailwindcss/colors"
import Button from "../components/ui/button"
import Flex from "../components/ui/flex"
import Text from "../components/ui/text"
import { useAppState } from "../state"
import SelectableFederation from "../components/selectable-federation"

export default function FederationsOnboarding() {
  const [selectedFederations, setSelectedFederations] = useState<
    Array<FederationItemSchema>
  >([])
  const state = useAppState()
  const gradient = useCallback((p: number) => {
    const rotateFactor = p * 30
    const sizeFactor = p * 100

    return gr.merge(
      gr.radial(
        `circle at ${50 + 60 * p}% ${110 - 110 * p}%`,
        colors.sky["700"] + "f6",
        colors.sky["800"] + "c5 100px",
        "transparent 300px",
        "transparent",
      ),
      gr.rLinear(
        -5 + rotateFactor,
        ...gr.stack(
          ["transparent", 50 + sizeFactor],
          [colors.gray["500"] + "25", 52 + sizeFactor],
        ),
      ),
      gr.rLinear(
        -95 + rotateFactor,
        ...gr.stack(
          ["transparent", 50 + sizeFactor],
          [colors.gray["500"] + "25", 52 + sizeFactor],
        ),
      ),
    )
  }, [])

  const initialBackground = useMotionValue(gradient(0))
  const background = useSpring(initialBackground, {
    damping: 25,
  })

  useEffect(() => {
    if (background) {
      background.set(gradient(1))
    }
  }, [gradient, background])

  return (
    <Flex
      col
      gap={2}
      p={4}
      align="center"
      justify="between"
      className="h-screen"
      asChild
    >
      <motion.div
        style={{ background }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Text weight="medium" size="base">
          Join Federations
        </Text>

        <Flex col gap={2} width="full">
          {federations.map((federation, index) => (
            <SelectableFederation
              {...federation}
              key={index}
              selected={selectedFederations.some(x => x.id === federation.id)}
              onSelect={() => {
                if (selectedFederations.some(x => x.id === federation.id)) {
                  setSelectedFederations(
                    selectedFederations.filter(x => x.id !== federation.id),
                  )
                } else {
                  setSelectedFederations([...selectedFederations, federation])
                }
              }}
            />
          ))}
        </Flex>

        <Flex col gap={2} width="full">
          <Button
            disabled={selectedFederations.length === 0}
            onClick={() => {
              LocalStore.joinFederations(selectedFederations)
              state.setOnboardingStep(2)
            }}
          >
            Continue ({selectedFederations.length})
          </Button>
          <Button
            variant="secondary"
            size="small"
            onClick={() => alert("Not implemented")}
          >
            Join by Invite Code
          </Button>
        </Flex>
      </motion.div>
    </Flex>
  )
}
