import { WeblnParams } from "@/background/handlers/webln"
import { sendExtensionMessage } from "@/common/messaging/extension"
import Text from "@/common/ui/text"
import ConfirmationBase from "../base"

export default function WeblnSendPayment({
  method,
  params,
}: Extract<WeblnParams, { method: "sendPayment" }>) {
  return (
    <ConfirmationBase
      title="Send Payment"
      method={method}
      onAccept={() => {
        sendExtensionMessage({
          type: "prompt",
          accept: true,
          method,
          params,
        })
      }}
    >
      <Text size="sm" className="text-gray-500 break-all w-full" multiline>
        {JSON.stringify(params)}
      </Text>
    </ConfirmationBase>
  )
}
