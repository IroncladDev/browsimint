import { FederationItemSchema } from "@/common/types"
import Flex from "@common/ui/flex"
import Text from "@common/ui/text"
import { Check } from "lucide-react"
import { styled } from "react-tailwind-variants"

export default function SelectableFederation({
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
        <Flex grow>
          {network === "signet" && <Pill selected={selected}>Signet</Pill>}
        </Flex>
        {selected && (
          <SelectedIndicator>
            <Check className="w-4 h-4" />
          </SelectedIndicator>
        )}
      </button>
    </ItemContainer>
  )
}

const SelectedIndicator = styled("div", {
  base: "text-cyan-500 border-1.5 border-cyan-600 bg-sky-800 rounded-full w-6 h-6 flex items-center justify-center",
})

const Pill = styled("div", {
  base: "rounded-full px-2 py-1 text-xs font-medium text-gray-400 bg-gray-700/50",
  variants: {
    selected: {
      true: "text-cyan-500 bg-sky-800/75",
    },
  },
})

const ItemContainer = styled(Flex, {
  base: "rounded-lg border-2 bg-gray-800/50 border-gray-600/50 hover:bg-gray-800/75 hover:border-gray-600/75 transition-colors",
  variants: {
    selected: {
      true: "border-cyan-600/50 bg-sky-800/50 hover:bg-sky-800/75 hover:border-cyan-600/75",
    },
  },
})
