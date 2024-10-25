import gr from "@common/gradients"
import Flex from "@common/ui/flex"
import Text from "@common/ui/text"
import { motion } from "framer-motion"
import { Landmark, Zap } from "lucide-react"
import { styled } from "react-tailwind-variants"
import colors from "tailwindcss/colors"
import Switcher from "./components/switcher"
import FederationsOnboarding from "./onboarding/federations"
import IntroOnboarding from "./onboarding/intro"
import NostrOnboarding from "./onboarding/nostr"
import { useAppState } from "./state"
import ReceiveEcash from "./widgets/receive-ecash"
import ReceiveLN from "./widgets/receive-ln"
import SendEcash from "./widgets/send-ecash"
import SendLN from "./widgets/send-ln"

export default function Popup() {
  const state = useAppState()

  const background = gr.merge(
    gr.radial(
      "circle at 50% 120%",
      colors.sky["700"] + "f6",
      colors.sky["800"] + "e8 20%",
      "transparent 70%",
      "transparent",
    ),
  )

  if (
    state.onboardingStep === 0 &&
    state.federations.length === 0 &&
    state.nostrSecretKey === null
  ) {
    return <IntroOnboarding />
  }

  if (state.onboardingStep === 1 && state.federations.length === 0) {
    return <FederationsOnboarding />
  }

  if (state.onboardingStep === 2 && state.nostrSecretKey === null) {
    return <NostrOnboarding />
  }

  return (
    <Flex col gap={2} p={4} className="h-screen" asChild>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{ background }}
      >
        <Flex justify="center">
          <Switcher />
        </Flex>

        <Flex col center width="full" className="py-6">
          <Text size="h1">{Math.floor(state.balance / 1000)} sats</Text>
        </Flex>

        <Fieldset>
          <Legend>
            <Text color="dimmer" size="lg">
              Lightning
            </Text>
            <Zap className="w-4 h-4" />
          </Legend>
          <Flex gap={4}>
            <ReceiveLN />
            <SendLN />
          </Flex>
        </Fieldset>

        <Fieldset>
          <Legend>
            <Text color="dimmer" size="lg">
              Ecash
            </Text>
            <Landmark className="w-4 h-4" />
          </Legend>
          <Flex gap={4}>
            <ReceiveEcash />
            <SendEcash />
          </Flex>
        </Fieldset>
      </motion.div>
    </Flex>
  )
}

const Fieldset = styled("fieldset", {
  base: "flex flex-col gap-4 px-4 pt-2 pb-4 rounded-lg border-2 border-cyan-700/50 bg-gray-900/50",
})

const Legend = styled("legend", {
  base: "flex row gap-1 items-center px-2",
})
