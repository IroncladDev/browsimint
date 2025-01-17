import { DialogHeader } from "@/common/ui/dialog"
import { MotionSlideIn } from "@/common/ui/motion"
import { makeInternalCall } from "@/popup/messaging"
import Button from "@common/ui/button"
import Flex from "@common/ui/flex"
import Input from "@common/ui/input"
import Text from "@common/ui/text"
import { MintSpendNotesResponse } from "@fedimint/core-web"
import { Dispatch, SetStateAction, useState } from "react"

export default function InputAmount({
  onNotes,
  onError,
}: {
  onNotes: Dispatch<SetStateAction<MintSpendNotesResponse | null>>
  onError: Dispatch<SetStateAction<string | null>>
}) {
  const [amount, setAmount] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleSpendNotes = async () => {
    setLoading(true)

    const res = await makeInternalCall<MintSpendNotesResponse>({
      method: "spendEcash",
      params: {
        minAmount: amount * 1000,
        includeInvite: false
      },
    })

    if (res.success) {
      onNotes(res.data)
    } else {
      onError(res.message)
    }
    setLoading(false)
  }

  return (
    <MotionSlideIn className="flex flex-col gap-4">
      <DialogHeader title="Spend Ecash Notes" />
      <Flex col gap={1} width="full" grow>
        <Text>Amount (sats)</Text>
        <Input
          type="number"
          value={String(amount)}
          onChange={e => setAmount(Number(e.target.value))}
          autoFocus
        />
      </Flex>
      <Button onClick={handleSpendNotes} disabled={loading || amount === 0}>
        Send
      </Button>
    </MotionSlideIn>
  )
}
