import Button from "@common/ui/button"
import Flex from "@common/ui/flex"
import Input from "@common/ui/input"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@common/ui/sheet"
import Text from "@common/ui/text"
import { useToast } from "@common/ui/use-toast"
import { OutgoingLightningPayment } from "@fedimint/core-web"
import { ArrowUp } from "lucide-react"
import { useEffect, useState } from "react"
import { makeInternalCall } from "../messaging"

export default function SendLN() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [invoice, setInvoice] = useState("")
  const { toast } = useToast()

  const reset = () => {
    setLoading(false)
    setInvoice("")
  }

  const handlePayInvoice = async () => {
    setLoading(true)

    const res = await makeInternalCall<OutgoingLightningPayment>({
      method: "payInvoice",
      params: { invoice },
    })

    if (res.success) {
      toast({ title: "Invoice Paid" })
      setOpen(false)
      reset()
    } else {
      setLoading(false)
      toast({
        title: "Failed to pay invoice",
        description: res.message,
        variant: "destructive",
      })
    }
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
        <Flex col gap={4} p={2}>
          <SheetTitle>Pay Lightning Invoice</SheetTitle>
          <Input value={invoice} onChange={e => setInvoice(e.target.value)} />
          <Button onClick={handlePayInvoice} disabled={loading}>
            Pay
          </Button>
        </Flex>
      </SheetContent>
    </Sheet>
  )
}
