import { MotionSlideIn } from "@/common/ui/motion"
import Flex from "@/common/ui/flex"
import Text from "@/common/ui/text"
import Input from "@/common/ui/input"
import Button from "@/common/ui/button"
import { Dispatch, SetStateAction, useCallback, useState } from "react"
import { makeInternalCall } from "@/popup/messaging"
import { DialogHeader } from "@/common/ui/dialog"

export default function InputToken({
  onReceived,
  onError,
}: {
  onReceived: (msats: number) => void
  onError: Dispatch<SetStateAction<string | null>>
}) {
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRedeem = useCallback(async () => {
    setLoading(true)

    const res = await makeInternalCall<number>({
      method: "redeemEcash",
      params: {
        notes,
      },
    })

    if (res.success) {
      onReceived(res.data)
    } else {
      onError(res.message)
    }
  }, [notes])

  return (
    <MotionSlideIn className="flex flex-col gap-4">
      <DialogHeader title="Redeem Ecash notes" />
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
      <Button onClick={handleRedeem} disabled={loading}>
        Receive
      </Button>
    </MotionSlideIn>
  )
}
