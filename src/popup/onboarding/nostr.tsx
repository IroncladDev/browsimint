import gr from "@common/gradients"
import { LocalStore } from "@common/storage"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { useCallback, useEffect, useState } from "react"
import colors from "tailwindcss/colors"
import { Button } from "../components/ui/button"
import Flex from "../components/ui/flex"
import { Input } from "../components/ui/input"
import Text from "../components/ui/text"
import { useAppState } from "../state"

export default function NostrOnboarding() {
  const [nsec, setNsec] = useState("")
  const state = useAppState()

  const gradient = useCallback((p: number) => {
    const atSeventh = (n: number) =>
      `circle at ${
        Math.cos(((Math.PI * 2) / 7) * n) * 250 * p
      }px ${Math.sin(((Math.PI * 2) / 7) * n) * 250 * p}px`

    return gr.merge(
      gr.radial(
        `circle at ${110 - 110 * p}% 0%`,
        colors.sky["700"] + "d5",
        colors.sky["800"] + "a4 120px",
        "transparent 130px",
        "transparent",
      ),
      gr.radial(
        atSeventh(0),
        colors.sky["700"] + "d5",
        colors.sky["800"] + "a4 50px",
        "transparent 60px",
        "transparent",
      ),
      gr.radial(
        atSeventh(1),
        colors.sky["700"] + "d5",
        colors.sky["800"] + "a4 50px",
        "transparent 60px",
        "transparent",
      ),
      gr.radial(
        atSeventh(2),
        colors.sky["700"] + "d5",
        colors.sky["800"] + "a4 50px",
        "transparent 60px",
        "transparent",
      ),
      gr.radial(
        atSeventh(3),
        colors.sky["700"] + "d5",
        colors.sky["800"] + "a4 50px",
        "transparent 60px",
        "transparent",
      ),
      gr.radial(
        atSeventh(4),
        colors.sky["700"] + "d5",
        colors.sky["800"] + "a4 50px",
        "transparent 60px",
        "transparent",
      ),
      gr.radial(
        atSeventh(5),
        colors.sky["700"] + "d5",
        colors.sky["800"] + "a4 50px",
        "transparent 60px",
        "transparent",
      ),
      gr.radial(
        atSeventh(6),
        colors.sky["700"] + "d5",
        colors.sky["800"] + "a4 50px",
        "transparent 60px",
        "transparent",
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
    <Flex col gap={2} p={4} className="h-screen" asChild>
      <motion.div
        style={{ background }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Flex grow col gap={2}>
          <Text weight="medium" size="base">
            Nostr
          </Text>
          <Flex col gap={1}>
            <Text>Nostr Secret Key</Text>
            <Input
              value={nsec}
              onChange={e => setNsec(e.target.value)}
              type="password"
              placeholder="nsec..."
            />
          </Flex>
        </Flex>

        <Flex col gap={2} width="full">
          <Button
            disabled={nsec.length === 0}
            onClick={() => {
              LocalStore.setKey("nsec", nsec)
              state.setOnboardingStep(3)
            }}
          >
            Save
          </Button>
          <Button
            variant="secondary"
            small
            onClick={() => state.setOnboardingStep(3)}
          >
            Skip
          </Button>
        </Flex>
      </motion.div>
    </Flex>
  )
}
