import { MotionSlideIn } from "@/common/ui/motion"
import { decodeInvoice } from "@/common/utils"
import Button from "@common/ui/button"
import Flex from "@common/ui/flex"
import { SheetClose } from "@common/ui/sheet"
import Text from "@common/ui/text"
import { styled } from "react-tailwind-variants"
import { motion } from "framer-motion"
import colors from "tailwindcss/colors"
import { CheckIcon } from "lucide-react"
import SheetHeader from "../../sheet-header"

export default function DisplaySuccess({
  invoice,
  onReset,
}: {
  invoice: string
  onReset: () => void
}) {
  const decoded = decodeInvoice(invoice)

  return (
    <MotionSlideIn className="flex flex-col gap-4">
      <SheetHeader title="Lightning Invoice" />

      <Flex center>
        <SuccessContainer
          initial={{ borderColor: colors.gray["500"] + "7f" }}
          animate={{ borderColor: colors.cyan["500"] + "ab" }}
          transition={{ delay: 0.5 }}
        >
          <Flex col center gap={2}>
            <CheckIcon className="w-5 h-5 opacity-0" />
            <Text size="xl" weight="medium">
              You sent {decoded.satoshis} sats
            </Text>
            <CheckIcon className="w-5 h-5" />
          </Flex>
        </SuccessContainer>
      </Flex>

      <Flex col gap={2}>
        <Button onClick={onReset}>Send another payment</Button>
        <SheetClose asChild>
          <Button variant="secondary" size="small">
            Done
          </Button>
        </SheetClose>
      </Flex>
    </MotionSlideIn>
  )
}

const SuccessContainer = styled(motion.div, {
  base: "flex aspect-square w-full rounded-full border-2 border-gray-500/50 align-center justify-center max-h-[256px] max-w-[256px]",
})
