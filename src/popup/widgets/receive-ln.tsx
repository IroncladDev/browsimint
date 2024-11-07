import { MotionAnimatedHeight, MotionSlideIn } from "@/common/ui/motion"
import { QrCode } from "@/common/ui/qr"
import { decodeInvoice } from "@/common/utils"
import Button from "@common/ui/button"
import Flex from "@common/ui/flex"
import Input from "@common/ui/input"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@common/ui/sheet"
import Text from "@common/ui/text"
import { useToast } from "@common/ui/use-toast"
import { CreateBolt11Response, LnReceiveState } from "@fedimint/core-web"
import { AnimatePresence } from "framer-motion"
import { ArrowDown, Loader2Icon, XIcon } from "lucide-react"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { styled } from "react-tailwind-variants"
import { makeInternalCall } from "../messaging"

function CreateInvoice({
  onInvoice,
  onError,
}: {
  onInvoice: Dispatch<SetStateAction<CreateBolt11Response | null>>
  onError: Dispatch<SetStateAction<string | null>>
}) {
  const [amount, setAmount] = useState(0)
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)

  const handleCreateInvoice = async () => {
    setLoading(true)

    const res = await makeInternalCall<CreateBolt11Response>({
      method: "createInvoice",
      params: {
        amount: amount * 1000,
        description,
        expiryTime: 6,
      },
    })

    if (res.success) {
      onInvoice(res.data)
    } else {
      onError(res.message)
    }
    setLoading(false)
  }

  return (
    <MotionSlideIn className="flex flex-col gap-4">
      <Header title="Request Lightning Payment" />
      <Flex col gap={1} width="full" grow>
        <Text>Amount (sats)</Text>
        <Input
          type="number"
          value={String(amount)}
          onChange={e => setAmount(Number(e.target.value))}
        />
      </Flex>
      <Flex col gap={1} width="full" grow>
        <Text>Description</Text>
        <Input asChild>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={2}
            className="min-h-[60px]"
          />
        </Input>
      </Flex>
      <Button onClick={handleCreateInvoice} disabled={loading || amount === 0}>
        Request
      </Button>
    </MotionSlideIn>
  )
}

function DisplayInvoice({ invoice }: { invoice: CreateBolt11Response }) {
  const { toast } = useToast()

  return (
    <MotionSlideIn className="flex flex-col gap-4">
      <Header title="Lightning Invoice" />
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

const DisplayError = ({ error }: { error: string }) => {
  return (
    <MotionSlideIn className="flex flex-col gap-4">
      <Header title="Error" />
      <Text>{error}</Text>
    </MotionSlideIn>
  )
}

const DisplaySuccess = ({
  invoice,
  onReset,
}: {
  invoice: CreateBolt11Response
  onReset: () => void
}) => {
  const decoded = decodeInvoice(invoice.invoice)

  return (
    <MotionSlideIn className="flex flex-col gap-4">
      <Header title="Lightning Invoice" />

      <Flex center p={4}>
        <Text size="xl" weight="medium">
          You received {decoded.satoshis} sats
        </Text>
      </Flex>

      <Flex col gap={2}>
        <Button onClick={onReset}>Receive another payment</Button>
        <SheetClose asChild>
          <Button variant="secondary" size="small">
            Done
          </Button>
        </SheetClose>
      </Flex>
    </MotionSlideIn>
  )
}

export default function ReceiveLN() {
  const [open, setOpen] = useState(false)
  const [invoice, setInvoice] = useState<CreateBolt11Response | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [paid, setPaid] = useState(false)

  const reset = () => {
    setInvoice(null)
    setError(null)
    setPaid(false)
  }

  useEffect(() => {
    if (!open) reset()
  }, [open])

  useEffect(() => {
    async function handleAwaitInvoice() {
      if (!invoice) return

      const res = await makeInternalCall<LnReceiveState>({
        method: "awaitInvoice",
        params: {
          operationId: invoice.operation_id,
        },
      })

      if (res.success) {
        setPaid(true)
      } else {
        setError(res.message)
      }
    }

    handleAwaitInvoice()
  }, [invoice])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button fullWidth variant="secondary" grow>
          <Text>Request</Text>
          <ArrowDown className="w-5 h-5" />
        </Button>
      </SheetTrigger>

      <SheetContent>
        <Flex col gap={4} asChild>
          <MotionAnimatedHeight>
            <AnimatePresence initial={false} mode="popLayout">
              {error ? (
                <DisplayError error={error} key="error" />
              ) : invoice ? (
                paid ? (
                  <DisplaySuccess
                    invoice={invoice}
                    onReset={reset}
                    key="success"
                  />
                ) : (
                  <DisplayInvoice invoice={invoice} key="invoice" />
                )
              ) : (
                <CreateInvoice
                  onInvoice={setInvoice}
                  onError={setError}
                  key="create"
                />
              )}
            </AnimatePresence>
          </MotionAnimatedHeight>
        </Flex>
      </SheetContent>
    </Sheet>
  )
}

function Header({ title }: { title: string }) {
  return (
    <Flex gap={2} align="center" justify="between">
      <SheetTitle>{title}</SheetTitle>
      <SheetClose>
        <XIcon className="w-5 h-5 text-gray-500" />
      </SheetClose>
    </Flex>
  )
}

const QRContainer = styled("div", {
  base: "flex align-center justify-center p-4 border-2 rounded-lg border-gray-500/50",
})
