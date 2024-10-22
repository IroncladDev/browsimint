import { UnsignedNostrEvent } from "../../providers/nostr/types";
import { validateEvent, finalizeEvent, getPublicKey, nip19 } from "nostr-tools";
import { Buffer } from "buffer";

export type NostrParams =
  | {
      method: "getPublicKey";
      params: undefined;
    }
  | {
      method: "signEvent";
      params: UnsignedNostrEvent;
    };

export default async function handleNostrMessage({
  method,
  params,
}: NostrParams) {
  // TODO: import
  const nsec =
    "nsec1qq3ht6ve8eluz7mgmwyxzz7s0x94436tx72zf2xhxv73vzhtyuvq44m23j";

  let { data: rawKey } = nip19.decode(nsec);

  let hexStr = Buffer.from(rawKey).toString("hex");
  let uint8Array = Uint8Array.from(Buffer.from(hexStr, "hex"));

  switch (method) {
    case "getPublicKey":
      return getPublicKey(uint8Array);
    case "signEvent":
    default:
      const event = finalizeEvent(params, uint8Array);

      if (validateEvent(event)) {
        return event;
      }

      throw new Error("Invalid event");
  }
}
