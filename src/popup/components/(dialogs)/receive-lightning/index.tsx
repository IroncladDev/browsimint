import { MotionAnimatedHeight } from "@/common/ui/motion"
import { makeInternalCall } from "@/popup/messaging"
import Button from "@common/ui/button"
import Flex from "@common/ui/flex"
import { Sheet, SheetContent, SheetTrigger } from "@common/ui/sheet"
import Text from "@common/ui/text"
import { CreateBolt11Response, LnReceiveState } from "@fedimint/core-web"
import { AnimatePresence } from "framer-motion"
import { ArrowDown } from "lucide-react"
import { useEffect, useState } from "react"
import CreateInvoice from "./create-invoice"
import DisplayInvoice from "./display-invoice"
import DisplaySuccess from "./display-success"
import SheetError from "../../sheet-error"

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
                <SheetError error={error} key="error" />
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
