import { NostrParams } from "@/background/handlers/nostr"
import { sendExtensionMessage } from "@/common/messaging/extension"
import ConfirmationBase from "../base"
import KVTable from "../kv-table"

export default function NostrSignEvent({
  method,
  params,
}: Extract<NostrParams, { method: "signEvent" }>) {
  return (
    <ConfirmationBase
      title="Sign Event"
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
