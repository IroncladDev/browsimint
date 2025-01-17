import Button from "@/common/ui/button"
import Flex from "@/common/ui/flex"
import Text from "@/common/ui/text"
import { Sheet, SheetContent, SheetTrigger } from "@/common/ui/sheet"
import { ArrowDown } from "lucide-react"
import { MotionAnimatedHeight } from "@/common/ui/motion"
import { AnimatePresence } from "framer-motion"
import SheetError from "../../sheet-error"
import { useEffect, useState } from "react"
import InputToken from "./input-token"
import DisplaySuccess from "./display-success"

export default function ReceiveEcash() {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [msatsReceived, setMsatsReceived] = useState<number | null>(null)

  const reset = () => {
    setError(null)
    setMsatsReceived(null)
  }

  useEffect(() => {
    if (!open) reset()
  }, [open])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button fullWidth variant="secondary" grow>
          <Text>Receive</Text>
          <ArrowDown className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <Flex col gap={4} asChild>
          <MotionAnimatedHeight>
            <AnimatePresence initial={false} mode="popLayout">
              {error ? (
                <SheetError error={error} key="error" />
              ) : typeof msatsReceived === "number" ? (
                <DisplaySuccess key="success" msats={msatsReceived} onReset={reset} />
              ) : (
                <InputToken
                  key="input"
                  onReceived={msats => setMsatsReceived(msats)}
                  onError={setError}
                />
              )}
            </AnimatePresence>
          </MotionAnimatedHeight>
        </Flex>
      </SheetContent>
    </Sheet>
  )
}
