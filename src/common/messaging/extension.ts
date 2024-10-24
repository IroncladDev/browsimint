import { extensionMessage } from "@common/schemas"
import { ExtensionMessage } from "@common/types"
import browser from "webextension-polyfill"

export async function sendExtensionMessage(msg: ExtensionMessage) {
  const message = extensionMessage.parse(msg)

  return await browser.runtime.sendMessage(message)
}
