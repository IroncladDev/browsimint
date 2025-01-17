
import { DialogHeader } from "@/common/ui/dialog"
import { MotionSlideIn } from "@/common/ui/motion"
import { QrCode } from "@/common/ui/qr"
import Button from "@common/ui/button"
import Flex from "@common/ui/flex"
import Text from "@common/ui/text"
import { useToast } from "@common/ui/use-toast"
import { CreateBolt11Response } from "@fedimint/core-web"
import { Loader2Icon } from "lucide-react"
import { styled } from "react-tailwind-variants"

export default function DisplayInvoice({ invoice }: { invoice: CreateBolt11Response }) {
  const { toast } = useToast()

  return (
    <MotionSlideIn className="flex flex-col gap-4">
      <DialogHeader title="Lightning Invoice" />
      <QRContainer>
        <QrCode value={invoice.invoice} />
      </QRContainer>
      <Flex gap={2} center>
        <Text>Waiting for payment</Text>
        <Loader2Icon className="w-5 h-5 animate-spin" />
      </Flex>
      <Button
        onClick={() =>
          navigator.clipboard
            .writeText(invoice.invoice)
            .then(() => toast({ title: "Invoice Copied to clipboard" }))
        }
      >
        Copy to Clipboard
      </Button>
    </MotionSlideIn>
  )
}

const QRContainer = styled("div", {
  base: "flex align-center justify-center p-4 border-2 rounded-lg border-gray-500/50",
})
