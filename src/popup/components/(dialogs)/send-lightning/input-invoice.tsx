import { MotionSlideIn } from "@/common/ui/motion"
import { Dispatch, SetStateAction, useCallback, useState } from "react"
import Flex from "@/common/ui/flex"
import Text from "@/common/ui/text"
import Input from "@/common/ui/input"
import Button from "@/common/ui/button"
import { makeInternalCall } from "@/popup/messaging"
import { OutgoingLightningPayment } from "@fedimint/core-web"
import { DialogHeader } from "@/common/ui/dialog"

export default function InputInvoice({
  onPaid,
  onError,
}: {
  onPaid: (invoice: string) => void
  onError: Dispatch<SetStateAction<string | null>>
}) {
  const [recipient, setRecipient] = useState("")
  const [loading, setLoading] = useState(false)

  const handlePay = useCallback(async (data: string) => {
    setLoading(true)

    const invoice = data

    // TODO: validate recipient

    const res = await makeInternalCall<OutgoingLightningPayment>({
      method: "payInvoice",
      params: {
        invoice,
      },
    })

    if (res.success) {
      onPaid(invoice)
    } else {
      onError(res.message)
    }

    setLoading(false)
  }, [])

  return (
    <MotionSlideIn className="flex flex-col gap-4">
      <DialogHeader title="Request Lightning Payment" />
      <Flex col gap={1} width="full" grow>
        <Text>Recipient</Text>
        <Input
          value={recipient}
          onChange={e => setRecipient(e.target.value)}
        />
      </Flex>
      <Button onClick={() => handlePay(recipient)} disabled={loading}>
        Pay
      </Button>
    </MotionSlideIn>
  )
}
