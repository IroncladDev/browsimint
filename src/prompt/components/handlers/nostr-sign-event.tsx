import { NostrParams } from "@/background/handlers/nostr"
import ConfirmationBase from "../base"
import KVTable from "../kv-table"
import { sendExtensionMessage } from "@/common/messaging/extension"

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
