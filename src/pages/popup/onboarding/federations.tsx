import { styled } from "react-tailwind-variants";
import Flex from "../../../components/ui/flex";
import Text from "../../../components/ui/text";
import { federations } from "../constants";
import { useAppState } from "../state";
import { Check } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useCallback, useEffect } from "react";
import gr from "../../../lib/gradients";
import colors from "tailwindcss/colors";

export default function FederationsOnboarding() {
  const state = useAppState();
  const gradient = useCallback((p: number) => {
    const rotateFactor = p * 30;
    const sizeFactor = p * 100;

    return gr.merge(
      gr.radial(
        `circle at ${50 + (60 * p)}% ${110 - (110 * p)}%`,
        colors.sky["700"] + "f6",
        colors.sky["800"] + "c5 100px",
        "transparent 300px",
        "transparent"
      ),
      gr.rLinear(
        -5 + rotateFactor,
        ...gr.stack(
          ["transparent", 50 + sizeFactor],
          [colors.gray["500"] + "25", 52 + sizeFactor]
        )
      ),
      gr.rLinear(
        -95 + rotateFactor,
        ...gr.stack(
          ["transparent", 50 + sizeFactor],
          [colors.gray["500"] + "25", 52 + sizeFactor]
        )
      )
    );
  }, []);

  const initialBackground = useMotionValue(gradient(0));
  const background = useSpring(initialBackground, {
    damping: 25,
  });

  useEffect(() => {
    if (background) {
      background.set(gradient(1));
    }
  }, [gradient, background]);

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
            <FederationItem
              name={federation.name}
              icon={federation.icon}
              network={federation.network}
              key={index}
            />
          ))}
        </Flex>

        <Flex col gap={2} width="full">
          <Button
            disabled={state.joinedFederations.length === 0}
            onClick={() => {
              state.setActiveFederation(state.joinedFederations[0]);
              state.setOnboardingStep(2);
            }}
          >
            Continue ({state.joinedFederations.length})
          </Button>
          <Button
            variant="secondary"
            small
            onClick={() => alert("Not implemented")}
          >
            Join by Invite Code
          </Button>
        </Flex>
      </motion.div>
    </Flex>
  );
}

function FederationItem({
  name,
  icon,
  network,
}: {
  name: string;
  icon: string;
  network: "signet" | "bitcoin";
}) {
  const state = useAppState();

  return (
    <ItemContainer
      gap={2}
      align="center"
      asChild
      selected={state.joinedFederations.includes(name)}
      onClick={() => {
        if (state.joinedFederations.includes(name)) {
          state.setJoinedFederations(
            state.joinedFederations.filter((x) => x !== name)
          );
        } else {
          state.setJoinedFederations([...state.joinedFederations, name]);
        }
      }}
      className="p-1.5"
    >
      <button>
        <img
          src={icon}
          alt={name}
          width={28}
          height={28}
          className="rounded-lg border border-gray-800"
        />
        <Text className="text-white">{name}</Text>
        <Flex grow>{network === "signet" && <Pill>Signet</Pill>}</Flex>
        {state.joinedFederations.includes(name) && (
          <SelectedIndicator>
            <Check className="w-4 h-4" />
          </SelectedIndicator>
        )}
      </button>
    </ItemContainer>
  );
}

const SelectedIndicator = styled("div", {
  base: "text-white bg-cyan-600 rounded-full w-5 h-5 flex items-center justify-center",
});

const Pill = styled("div", {
  base: "rounded-full px-2 py-1 text-xs font-medium text-gray-500 bg-gray-900 border border-gray-800",
});

const ItemContainer = styled(Flex, {
  base: "rounded-lg border border-gray-400/30 hover:bg-gray-800/50 transition-colors",
  variants: {
    selected: {
      true: "border-cyan-600",
    },
  },
});
