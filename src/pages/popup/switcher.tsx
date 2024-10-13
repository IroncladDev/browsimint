import { Check, ChevronDown } from "lucide-react";
import { styled } from "react-tailwind-variants";
import Text from "../../components/ui/text";
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet";
import { federations } from "./constants";
import Flex from "../../components/ui/flex";
import { useAppState } from "./state";
import { Button } from "../../components/ui/button";

export default function Switcher() {
  const state = useAppState();
  const activeFederation = federations.find(
    (f) => f.name === state.activeFederation
  );

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Outer>
          <Icon src={activeFederation?.icon} width={24} height={24} />
          <Text size="base" weight="medium" className="text-white">{activeFederation?.name}</Text>
          <ChevronDown className="w-4 h-4 text-white" />
        </Outer>
      </SheetTrigger>
      <SheetContent>
        <Flex col gap={4}>
          <Flex col gap={2}>
            {federations
              .filter((x) => state.joinedFederations.includes(x.name))
              .map((federation) => (
                <FederationSwitchItem
                  key={federation.name}
                  name={federation.name}
                  icon={federation.icon}
                  network={federation.network}
                />
              ))}
          </Flex>
          <Flex col gap={2}>
            <Button>Add New</Button>
            <Button variant="secondary" small>
              Manage
            </Button>
          </Flex>
        </Flex>
      </SheetContent>
    </Sheet>
  );
}

function FederationSwitchItem({
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
      selected={state.activeFederation === name}
      onClick={() => {
        state.setActiveFederation(name);
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
        {state.activeFederation === name && (
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
  base: "rounded-lg border border-gray-800 hover:bg-gray-800/50",
  variants: {
    selected: {
      true: "border-cyan-600",
    },
  },
});

const Outer = styled("button", {
  base: "rounded-lg p-1.5 pr-2 bg-gray-900 border border-gray-700 text-gray-400 outline-none flex items-center gap-2 hover:bg-gray-800 hover:border-gray-600 active:bg-gray-800 active:border-gray-500",
});

const Icon = styled("img", {
  base: "w-6 h-6",
});
