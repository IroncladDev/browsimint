import { messagePromptChoice } from "@/lib/schemas/messages"
import { MessagePromptChoice } from "@/types"
import browser from "webextension-polyfill"
import { openPrompt, releasePromptMutex, setWindowPrompt } from "../state"

export async function handlePromptMessage(
  msg: MessagePromptChoice,
  sender: any,
) {
  const message = messagePromptChoice.parse(msg)

  if (!message.accept || !openPrompt) return

  openPrompt.resolve(message)
  setWindowPrompt(null)
  releasePromptMutex()

  if (sender) {
    browser.windows.remove(sender.tab.windowId)
  }
}
