import ConfirmationBase from "../base"
import { useState } from "react"
import Flex from "@/common/ui/flex"
import Input from "@/common/ui/input"
import Text from "@/common/ui/text"
import { sendExtensionMessage } from "@/common/messaging/extension"

export default function WeblnMakeInvoice({
  method,
  params,
}: {
  method: "makeInvoice"
  params: {
    amount?: string | number
    defaultAmount?: string | number
    minimumAmount?: string | number
    maximumAmount?: string | number
    defaultMemo?: string
  }
}) {
  const [amount, setAmount] = useState<number>(
    Number(params.amount ?? params.defaultAmount ?? params.minimumAmount ?? 0),
  )
  const [description, setDescription] = useState<string>(
    params.defaultMemo ?? "",
  )

  return (
    <ConfirmationBase
      title="Create Invoice"
      method={method}
      onAccept={() => {
        sendExtensionMessage({
          type: "prompt",
          accept: true,
          method,
          params: {
            amount,
            description,
          },
        })
      }}
    >
      <Flex col gap={2} className="w-full">
        <Flex col gap={1}>
          <Text>Amount</Text>
          <Input
            disabled={typeof params.amount === "number"}
            value={amount}
            min={
              params.minimumAmount ? Number(params.minimumAmount) : undefined
            }
            max={
              params.maximumAmount ? Number(params.maximumAmount) : undefined
            }
            onChange={e => setAmount(Number(e.target.value))}
            type="number"
            inputMode="numeric"
            className="w-full"
          />
        </Flex>
        <Flex col gap={1}>
          <Text>Memo</Text>
          <Input asChild>
            <textarea
              maxLength={255}
              className="resize-y min-h-[60px]"
              placeholder="Memo..."
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
            ></textarea>
          </Input>
        </Flex>
      </Flex>
    </ConfirmationBase>
  )
}
