import { extensionMessage } from "@/lib/schemas/messages"
import { ExtensionMessage } from "@/types"
import browser from "webextension-polyfill"

export async function sendExtensionMessage(msg: ExtensionMessage) {
  const message = extensionMessage.parse(msg)

  return await browser.runtime.sendMessage(message)
}
