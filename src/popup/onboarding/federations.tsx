import { styled } from "react-tailwind-variants";
import Flex from "../../components/ui/flex";
import Text from "../../components/ui/text";
import { useAppState } from "../state";
import { Check } from "lucide-react";
import { Button } from "../../components/ui/button";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import gr from "../../lib/gradients";
import colors from "tailwindcss/colors";
import { federations } from "../../lib/constants";
import { FederationItemSchema, LocalStore } from "../../lib/storage";

export default function FederationsOnboarding() {
  const [selectedFederations, setSelectedFederations] = useState<
    Array<FederationItemSchema>
  >([]);
  const state = useAppState();
  const gradient = useCallback((p: number) => {
    const rotateFactor = p * 30;
    const sizeFactor = p * 100;

    return gr.merge(
      gr.radial(
        `circle at ${50 + 60 * p}% ${110 - 110 * p}%`,
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
              {...federation}
              key={index}
              selected={selectedFederations.some((x) => x.id === federation.id)}
              onSelect={() => {
                if (selectedFederations.some((x) => x.id === federation.id)) {
                  setSelectedFederations(
                    selectedFederations.filter((x) => x.id !== federation.id)
                  );
                } else {
                  setSelectedFederations([...selectedFederations, federation]);
                }
              }}
            />
          ))}
        </Flex>

        <Flex col gap={2} width="full">
          <Button
            disabled={selectedFederations.length === 0}
            onClick={() => {
              LocalStore.joinFederations(selectedFederations);
              state.setOnboardingStep(2);
            }}
          >
            Continue ({selectedFederations.length})
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
  selected,
  onSelect,
}: FederationItemSchema & { selected: boolean; onSelect: () => void }) {
  return (
    <ItemContainer
      gap={2}
      align="center"
      asChild
      selected={selected}
      onClick={onSelect}
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
        {selected && (
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
