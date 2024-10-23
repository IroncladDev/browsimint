import Switcher from "./switcher";
import Flex from "../components/ui/flex";
import Text from "../components/ui/text";
import { useAppState } from "./state";
import IntroOnboarding from "./onboarding/intro";
import FederationsOnboarding from "./onboarding/federations";
import NostrOnboarding from "./onboarding/nostr";
import { styled } from "react-tailwind-variants";
import ReceiveLN from "./widgets/receive-ln";
import SendLN from "./widgets/send-ln";
import ReceiveEcash from "./widgets/receive-ecash";
import SendEcash from "./widgets/send-ecash";
import { motion } from "framer-motion";
import gr from "../lib/gradients";
import colors from "tailwindcss/colors";

export default function Popup() {
  const state = useAppState();

  const background = gr.merge(
    gr.radial(
      "circle at 50% 120%",
      colors.sky["700"] + "f6",
      colors.sky["800"] + "e8 20%",
      "transparent 70%",
      "transparent"
    )
  );

  if (
    state.onboardingStep === 0 &&
    state.federations.length === 0 &&
    state.nostrSecretKey === null
  ) {
    return <IntroOnboarding />;
  }

  if (state.onboardingStep === 1 && state.federations.length === 0) {
    return <FederationsOnboarding />;
  }

  if (state.onboardingStep === 2 && state.nostrSecretKey === null) {
    return <NostrOnboarding />;
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

        <Fieldset>
          <Legend>Balance</Legend>
          <Text>{state.balance} sats</Text>
        </Fieldset>

        <Fieldset>
          <Legend>Lightning ⚡</Legend>
          <Flex gap={2}>
            <ReceiveLN />
            <SendLN />
          </Flex>
        </Fieldset>

        <Fieldset>
          <Legend>Ecash 💰</Legend>
          <Flex gap={2}>
            <ReceiveEcash />
            <SendEcash />
          </Flex>
        </Fieldset>
      </motion.div>
    </Flex>
  );
}

const Fieldset = styled("fieldset", {
  base: "flex flex-col gap-2 px-2 pt-1 pb-2 rounded-lg border border-gray-600/50 bg-gray-900/50",
});

const Legend = styled("legend", {
  base: "text-white text-sm font-medium",
});
