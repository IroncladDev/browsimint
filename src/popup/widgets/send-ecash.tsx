import { Button } from "@/components/ui/button"
import Flex from "@/components/ui/flex"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import Text from "@/components/ui/text"
import { useToast } from "@/components/ui/use-toast"
import { MintSpendNotesResponse } from "@fedimint/core-web"
import { useEffect, useState } from "react"
import { makeInternalCall } from "../messaging"

export default function SendEcash() {
  const [amount, setAmount] = useState(0)
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const reset = () => {
    setAmount(0)
    setLoading(false)
  }

  const handleSpendEcash = async () => {
    setLoading(true)

    const res = await makeInternalCall<MintSpendNotesResponse>({
      method: "spendEcash",
      params: {
        minAmount: amount * 1000,
        includeInvite: false,
      },
    })

    if (res.success) {
      navigator.clipboard.writeText(res.data.notes).then(() => {
        toast({ title: "Notes Copied to clipboard" })
        reset()
        setOpen(false)
      })
    } else {
      toast({
        title: "Failed to spend notes",
        description: res.message,
      })
    }
  }

  useEffect(() => {
    if (!open) reset()
  }, [open])

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button small fullWidth variant="secondary" grow>
          Send
        </Button>
      </SheetTrigger>
      <SheetContent>
        <Flex col gap={4} p={2}>
          <SheetTitle>Send Ecash Notes</SheetTitle>
          <Flex col gap={1} width="full" grow>
            <Text>Amount (sats)</Text>
            <Input
              type="number"
              value={String(amount)}
              onChange={e => setAmount(Number(e.target.value))}
            />
          </Flex>
          <Button onClick={handleSpendEcash} disabled={loading}>
            Send
          </Button>
        </Flex>
      </SheetContent>
    </Sheet>
  )
}
