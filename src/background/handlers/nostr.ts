import { UnsignedNostrEvent } from "@/injection/providers/nostr"
import { LocalStore } from "@/lib/storage"
import { Buffer } from "buffer"
import { finalizeEvent, getPublicKey, nip19, validateEvent } from "nostr-tools"

export type NostrParams =
  | {
      method: "getPublicKey"
      params: undefined
    }
  | {
      method: "signEvent"
      params: UnsignedNostrEvent
    }

export default async function handleNostrMessage({
  method,
  params,
}: NostrParams) {
  // TODO: import
  const nsec = await LocalStore.getNsec()

  if (!nsec) throw new Error("No nsec found")

  let { data: rawKey } = nip19.decode(nsec)

  let hexStr = Buffer.from(rawKey as string).toString("hex")
  let uint8Array = Uint8Array.from(Buffer.from(hexStr, "hex"))

  switch (method) {
    case "getPublicKey":
      return getPublicKey(uint8Array)
    case "signEvent":
    default:
      const event = finalizeEvent(params, uint8Array)

      if (validateEvent(event)) {
        return event
      }

      throw new Error("Invalid event")
  }
}
