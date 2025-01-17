import { MotionAnimatedHeight } from "@/common/ui/motion"
import Button from "@common/ui/button"
import Flex from "@common/ui/flex"
import { Sheet, SheetContent, SheetTrigger } from "@common/ui/sheet"
import Text from "@common/ui/text"
import { AnimatePresence } from "framer-motion"
import { ArrowUp } from "lucide-react"
import { useEffect, useState } from "react"
import SheetError from "../../sheet-error"
import DisplaySuccess from "./display-success"
import InputInvoice from "./input-invoice"

export default function SendLN() {
  const [open, setOpen] = useState(false)
  const [paidInvoice, setPaidInvoice] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const reset = () => {
    setPaidInvoice(null)
    setError(null)
  }

  useEffect(() => {
    if (!open) reset()
  }, [open])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button fullWidth variant="secondary" grow>
          <Text>Pay</Text>
          <ArrowUp className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <Flex col gap={4} asChild>
          <MotionAnimatedHeight>
            <AnimatePresence initial={false} mode="popLayout">
              {error ? (
                <SheetError error={error} key="error" />
              ) : paidInvoice ? (
                <DisplaySuccess
                  invoice={paidInvoice}
                  onReset={reset}
                  key="success"
                />
              ) : (
                <InputInvoice
                  onPaid={setPaidInvoice}
                  onError={setError}
                  key="input"
                />
              )}
            </AnimatePresence>
          </MotionAnimatedHeight>
        </Flex>
      </SheetContent>
    </Sheet>
  )
}
