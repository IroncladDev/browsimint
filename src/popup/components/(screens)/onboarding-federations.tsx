import { FederationItemSchema } from "@/common/types"
import { federations } from "@common/constants"
import { LocalStore } from "@common/storage"
import Button from "@common/ui/button"
import Flex from "@common/ui/flex"
import Text from "@common/ui/text"
import {
  motion,
  useMotionTemplate,
  useSpring,
  useTransform,
} from "framer-motion"
import { useEffect, useState } from "react"
import colors from "tailwindcss/colors"
import { useAppState } from "../app-state-provider"
import SelectableFederation from "../selectable-federation"

export default function FederationsOnboarding() {
  const [selectedFederations, setSelectedFederations] = useState<
    Array<FederationItemSchema>
  >([])
  const state = useAppState()

  const bgSpring = useSpring(0, {
    damping: 25,
  })

  const mainCircle = useTransform(() => `radial-gradient(circle at ${50 + 60 * bgSpring.get()}% ${110 - 110 * bgSpring.get()}%, ${colors.sky["700"]}f6, ${colors.sky["800"]}c5 100px, transparent 300px, transparent)`)
  const gridX = useTransform(() => `repeating-linear-gradient(${-5 + 30 * bgSpring.get()}deg, transparent 0px, transparent ${50 + 100 * bgSpring.get()}px, ${colors.gray["500"]}25 ${52 + 100 * bgSpring.get()}px)`)
  const gridY = useTransform(() => `repeating-linear-gradient(${-95 + 30 * bgSpring.get()}deg, transparent 0px, transparent ${50 + 100 * bgSpring.get()}px, ${colors.gray["500"]}25 ${52 + 100 * bgSpring.get()}px)`)

  const background = useMotionTemplate`${mainCircle}, ${gridX}, ${gridY}`

  console.log(background)

  useEffect(() => {
    if (bgSpring) {
      bgSpring.set(1)
    }
  }, [bgSpring])

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
