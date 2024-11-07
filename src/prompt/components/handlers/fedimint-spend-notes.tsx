import { FedimintParams } from "@/background/handlers/fedimint"
import { sendExtensionMessage } from "@/common/messaging/extension"
import ConfirmationBase from "../base"
import KVTable from "../kv-table"

export default function FedimintSpendNotes({
  method,
  params,
}: Extract<FedimintParams, { method: "spendNotes" }>) {
  return (
    <ConfirmationBase
      title="Spend Ecash Notes"
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
      <KVTable data={params} />
    </ConfirmationBase>
  )
}
