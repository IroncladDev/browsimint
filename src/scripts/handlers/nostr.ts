import {
  NostrProviderMethods,
  UnsignedNostrEvent,
} from "../../providers/nostr/types";
import browser from "webextension-polyfill";
import { validateEvent, finalizeEvent, getPublicKey } from "nostr-tools";

export default async function handleNostrMessage<
  T extends keyof NostrProviderMethods
>(
  method: T,
  params: NostrProviderMethods[T][0]
): Promise<NostrProviderMethods[T][1]> {
  const storage = await browser.storage.local.get("nsec");
  const { nsec } = storage;

  if (!nsec) throw new Error("No nsec found");

  switch (method) {
    case "getPublicKey":
      return getPublicKey(nsec);
    case "signEvent":
    default:
      const event = finalizeEvent(params as UnsignedNostrEvent, nsec);

      if (validateEvent(event)) {
        return event;
      }

      throw new Error("Invalid event");
  }
}
