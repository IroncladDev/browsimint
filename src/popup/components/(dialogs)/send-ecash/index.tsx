import Button from "@/common/ui/button"
import Flex from "@/common/ui/flex"
import Text from "@/common/ui/text"
import { Sheet, SheetContent, SheetTrigger } from "@/common/ui/sheet"
import { Banknote } from "lucide-react"
import { MotionAnimatedHeight } from "@/common/ui/motion"
import { AnimatePresence } from "framer-motion"
import SheetError from "../../sheet-error"
import { useEffect, useState } from "react"
import { MintSpendNotesResponse } from "@fedimint/core-web"
import InputAmount from "./input-amount"
import DisplayNotes from "./display-notes"

export default function SendEcash() {
  const [open, setOpen] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [spentNotes, setSpentNotes] = useState<MintSpendNotesResponse | null>(
    null,
  )

  const reset = () => {
    setError(null)
    setSpentNotes(null)
  }

  useEffect(() => {
    if (!open) reset()
  }, [open])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button fullWidth variant="secondary" grow>
          <Text>Send</Text>
          <Banknote className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <Flex col gap={4} asChild>
          <MotionAnimatedHeight>
            <AnimatePresence initial={false} mode="popLayout">
              {error ? (
                <SheetError error={error} key="error" />
              ) : spentNotes ? (
                <DisplayNotes
                  notes={spentNotes}
                  key="notes"
                  onComplete={() => setOpen(false)}
                />
              ) : (
                <InputAmount
                  key="amount"
                  onNotes={setSpentNotes}
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
