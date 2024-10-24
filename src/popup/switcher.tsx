import { federations } from "@common/constants"
import { LocalStore } from "@common/storage"
import { ChevronDown } from "lucide-react"
import { useState } from "react"
import { styled } from "react-tailwind-variants"
import Button from "./components/ui/button"
import Flex from "./components/ui/flex"
import { Sheet, SheetContent, SheetTrigger } from "./components/ui/sheet"
import Text from "./components/ui/text"
import { useAppState } from "./state"
import SelectableFederation from "./components/selectable-federation"

export default function Switcher() {
  const [open, setOpen] = useState(false)
  const state = useAppState()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Outer>
          <Icon src={state.activeFederation?.icon} width={24} height={24} />
          <Text size="base" weight="medium" className="text-white">
            {state.activeFederation?.name}
          </Text>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </Outer>
      </SheetTrigger>
      <SheetContent>
        <Flex col gap={4}>
          <Flex col gap={2}>
            {federations
              .filter(x => state.federations.some(f => f.id === x.id))
              .map(federation => (
                <SelectableFederation
                  key={federation.name}
                  selected={state.activeFederation?.id === federation.id}
                  onSelect={() => {
                    LocalStore.setKey("activeFederation", federation.id)
                    setOpen(false)
                  }}
                  {...federation}
                />
              ))}
          </Flex>
          <Flex col gap={2}>
            <Button>Add New</Button>
            <Button variant="secondary" size="small">
              Manage
            </Button>
          </Flex>
        </Flex>
      </SheetContent>
    </Sheet>
  )
}

const Outer = styled("button", {
  base: `flex items-center gap-2 transition-all

  rounded-full px-3 py-1.5 border-1.5 outline-none

  bg-gray-800/50 text-gray-400 border-gray-600/50

  hover:bg-gray-800/75 hover:border-gray-600/75

  active:bg-gray-800/90 active:border-gray-600/90`,
})

const Icon = styled("img", {
  base: "w-6 h-6",
})
