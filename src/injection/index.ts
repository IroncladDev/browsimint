import FedimintProvider from "./providers/fedimint"
import NostrProvider from "./providers/nostr"
import WeblnProvider from "./providers/webln"

declare global {
  interface Window {
    fedimint: FedimintProvider
    nostr: NostrProvider
    webln: WeblnProvider
  }
}

window.fedimint = new FedimintProvider()
window.nostr = new NostrProvider()
window.webln = new WeblnProvider()
