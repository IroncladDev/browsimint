import { LocalStore } from "@common/storage"
import Button from "@common/ui/button"
import Flex from "@common/ui/flex"
import Input from "@common/ui/input"
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

export default function NostrOnboarding() {
  const [nsec, setNsec] = useState("")
  const state = useAppState()

  const atSeventh = (n: number, p: number) =>
    `radial-gradient(circle at ${
      Math.cos(((Math.PI * 2) / 7) * n) * 250 * p
    }px ${Math.sin(((Math.PI * 2) / 7) * n) * 250 * p}px, ${colors.sky["700"]}a4, ${colors.sky["800"]}da 50px, transparent 60px, transparent)`

  const bgSpring = useSpring(0, {
    damping: 25,
  })
  const mainCircle = useTransform(
    () =>
      `radial-gradient(circle at ${110 - 110 * bgSpring.get()}% 0%, ${colors.sky["700"]}a4, ${colors.sky["800"]}8a 120px, transparent 130px, transparent)`,
  )
  const c1 = useTransform(() => atSeventh(0, bgSpring.get()))
  const c2 = useTransform(() => atSeventh(1, bgSpring.get()))
  const c3 = useTransform(() => atSeventh(2, bgSpring.get()))
  const c4 = useTransform(() => atSeventh(3, bgSpring.get()))
  const background = useMotionTemplate`${mainCircle}, ${c1}, ${c2}, ${c3}, ${c4}`

  useEffect(() => {
    if (bgSpring) {
      bgSpring.set(1)
    }
  }, [bgSpring])

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
            size="small"
            onClick={() => state.setOnboardingStep(3)}
          >
            Skip
          </Button>
        </Flex>
      </motion.div>
    </Flex>
  )
}
