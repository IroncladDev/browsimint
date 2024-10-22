import { postMessage } from "./postMessage";

export default class NostrProvider {
  getPublicKey(): Promise<string> {
    return postMessage("signEvent", {}, "nostr");
  }

  signEvent(event: UnsignedNostrEvent): Promise<SignedNostrEvent> {
    return postMessage("signEvent", event, "nostr");
  }
}

export interface UnsignedNostrEvent {
    created_at: number
    kind: number
    content: string
    tags: Array<Array<string>>
}

export interface SignedNostrEvent extends UnsignedNostrEvent {
    id: string
    pubkey: string
    sig: string
}
