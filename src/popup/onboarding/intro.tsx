import gr from "@common/gradients"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { useCallback, useEffect } from "react"
import colors from "tailwindcss/colors"
import { Button } from "../components/ui/button"
import Flex from "../components/ui/flex"
import Text from "../components/ui/text"
import { useAppState } from "../state"

export default function IntroOnboarding() {
  const state = useAppState()

  const gradient = useCallback((p: number) => {
    return gr.merge(
      gr.radial(
        `circle at 50% 120%`,
        colors.sky["700"] + "f6",
        colors.sky["800"] + "e8 20%",
        "transparent 70%",
        "transparent",
      ),
      gr.rRadial(
        "circle at 50% 100%",
        ...gr.stack(
          ["#0000", `${25 + (1 - p) * 25}vh`],
          [colors.gray["500"] + "55", `calc(${25 + (1 - p) * 25}vh + 2px)`],
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
    <Flex col gap={6} p={4} center className="h-screen" asChild>
      <motion.div
        style={{ background }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Text size="xl" weight="bold">
          Browsimint
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
