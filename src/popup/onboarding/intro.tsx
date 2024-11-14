import Button from "@common/ui/button"
import Flex from "@common/ui/flex"
import Text from "@common/ui/text"
import {
  motion,
  useMotionTemplate,
  useSpring,
  useTransform,
} from "framer-motion"
import { useEffect } from "react"
import colors from "tailwindcss/colors"
import { useAppState } from "../state"

export default function IntroOnboarding() {
  const state = useAppState()

  const bgSpring = useSpring(1, {
    damping: 25,
  })
  const bgTransform = useTransform(() => 25 + bgSpring.get() * 25)
  const background = useMotionTemplate`radial-gradient(circle at 50% 120%, ${colors.sky["700"]}f6, ${colors.sky["800"]}e8 20%, transparent 70%, transparent),
repeating-radial-gradient(circle at 50% 100%, transparent, transparent ${bgTransform}vh, ${colors.gray["500"]}55 calc(${bgTransform}vh + 2px))`

  useEffect(() => {
    if (bgSpring) {
      bgSpring.set(0)
    }
  }, [bgSpring])

  return (
    <Flex col gap={6} p={4} center className="h-screen" asChild>
      <motion.div
        style={{ background }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Text size="h1" weight="bold" asChild>
          <h1>Browsimint</h1>
        </Text>
        <img
          src="/logo.svg"
          alt="logo"
          className="w-28 h-28 animate-spin"
          style={{ animationDuration: "15s" }}
        />
        <Button onClick={() => state.setOnboardingStep(1)}>Get Started</Button>
      </motion.div>
    </Flex>
  )
}
