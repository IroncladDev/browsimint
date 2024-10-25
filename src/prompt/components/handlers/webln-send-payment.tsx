import { WeblnParams } from "@/background/handlers/webln"
import ConfirmationBase from "../base"
import Text from "@/common/ui/text"
import { sendExtensionMessage } from "@/common/messaging/extension"

export default function WeblnSendPayment({
  method,
  params,
}: Extract<WeblnParams, { method: "sendPayment" }>) {
  return (
    <ConfirmationBase title="Send Payment" 
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
