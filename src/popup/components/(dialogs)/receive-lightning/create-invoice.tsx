import { DialogHeader } from "@/common/ui/dialog"
import { MotionSlideIn } from "@/common/ui/motion"
import { makeInternalCall } from "@/popup/messaging"
import Button from "@common/ui/button"
import Flex from "@common/ui/flex"
import Input from "@common/ui/input"
import Text from "@common/ui/text"
import { CreateBolt11Response } from "@fedimint/core-web"
import { Dispatch, SetStateAction, useState } from "react"

export default function CreateInvoice({
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
        expiryTime: 60 * 24,
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
    <MotionSlideIn className="flex flex-col gap-4 animate-height">
      <DialogHeader title="Request Lightning Payment" />
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
