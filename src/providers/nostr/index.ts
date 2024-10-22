import { NostrProviderMethods, UnsignedNostrEvent } from "./types";
import { postMessage } from "../postMessage";

export default class NostrProvider {
  getPublicKey() {
    return this.call("getPublicKey", {});
  }

  signEvent(event: UnsignedNostrEvent) {
    return this.call("signEvent", event);
  }

  private call<T extends keyof NostrProviderMethods>(
    type: T,
    params: NostrProviderMethods[T][0]
  ): Promise<NostrProviderMethods[T][1]> {
    return postMessage(type, params, "nostr");
  }
}
