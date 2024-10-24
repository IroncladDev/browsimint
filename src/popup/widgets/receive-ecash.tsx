import { useEffect, useState } from "react"
import { Button } from "../components/ui/button"
import Flex from "../components/ui/flex"
import { Input } from "../components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "../components/ui/sheet"
import Text from "../components/ui/text"
import { useToast } from "../components/ui/use-toast"
import { makeInternalCall } from "../messaging"

export default function ReceiveEcash() {
  const [notes, setNotes] = useState("")
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const reset = () => {
    setNotes("")
    setLoading(false)
  }

  const handleRedeemEcash = async () => {
    setLoading(true)

    const res = await makeInternalCall<number>({
      method: "redeemEcash",
      params: {
        notes,
      },
    })

    if (res.success) {
      toast({
        title: `Redeemed ${Math.round(res.data / 1000)} sats of ecash notes`,
      })

      reset()
      setOpen(false)
    } else {
      toast({
        title: "Error redeeming notes",
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
          Receive
        </Button>
      </SheetTrigger>
      <SheetContent>
        <Flex col gap={4} p={2}>
          <SheetTitle>Redeem Ecash Notes</SheetTitle>
          <Flex col gap={1} width="full" grow>
            <Text>Ecash Notes</Text>
            <Input asChild>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={2}
                className="min-h-[60px]"
              />
            </Input>
          </Flex>
          <Button onClick={handleRedeemEcash}>Paste</Button>
        </Flex>
      </SheetContent>
    </Sheet>
  )
}
