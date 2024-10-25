import { messagePromptChoice } from "@common/schemas"
import { MessagePromptChoice } from "@common/types"
import browser from "webextension-polyfill"
import { windowPrompt, releasePromptMutex, setWindowPrompt } from "../state"

export async function handlePromptMessage(
  msg: MessagePromptChoice,
  sender: any,
) {
  const message = messagePromptChoice.parse(msg)

  windowPrompt?.resolve(message)
  setWindowPrompt(null)
  releasePromptMutex()

  if (sender) {
    browser.windows.remove(sender.tab.windowId)
  }
}
