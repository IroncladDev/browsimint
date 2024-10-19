import { NostrProviderMethods, UnsignedNostrEvent } from "./types";
import { postMessage } from "../postMessage";

export default class NostrProvider {
  // 0 = No permission needed
  // 1 = Signature permission needed
  // 2 = Payment permission needed
  static permissions: Record<keyof NostrProviderMethods, 0 | 1 | 2> = {
    getPublicKey: 0,
    signEvent: 1,
  };

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
