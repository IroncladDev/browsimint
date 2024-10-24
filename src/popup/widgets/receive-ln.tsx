import Button from "@common/ui/button"
import Flex from "@common/ui/flex"
import Input from "@common/ui/input"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@common/ui/sheet"
import Text from "@common/ui/text"
import { useToast } from "@common/ui/use-toast"
import { CreateBolt11Response } from "@fedimint/core-web"
import { ArrowDown } from "lucide-react"
import { useEffect, useState } from "react"
import { makeInternalCall } from "../messaging"

export default function ReceiveLN() {
  const [amount, setAmount] = useState(0)
  const [description, setDescription] = useState("")
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const reset = () => {
    setAmount(0)
    setDescription("")
    setLoading(false)
  }

  const handleCreateInvoice = async () => {
    setLoading(true)

    const res = await makeInternalCall<CreateBolt11Response>({
      method: "createInvoice",
      params: {
        amount: amount * 1000,
        description,
      },
    })

    if (res.success) {
      navigator.clipboard.writeText(res.data.invoice).then(() => {
        toast({ title: "Invoice Copied to clipboard" })
        reset()
        setOpen(false)
      })
    } else {
      setLoading(false)
      toast({
        title: "Failed to create invoice",
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
          <Text>Request</Text>
          <ArrowDown className="w-5 h-5" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <Flex col gap={4} p={2}>
          <SheetTitle>Request Lightning Payment</SheetTitle>
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
          <Button onClick={handleCreateInvoice} disabled={loading}>
            Request
          </Button>
        </Flex>
      </SheetContent>
    </Sheet>
  )
}
