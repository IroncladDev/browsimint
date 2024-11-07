import { promptHeight, promptWidth } from "@/common/constants"
import { sendExtensionMessage } from "@common/messaging/extension"
import { postWindowMessage } from "@common/messaging/window"
import { messageModuleCall } from "@common/schemas"
import { MessageModuleCall } from "@common/types"
import browser from "webextension-polyfill"
import { calculateOptimalPopoverPosition } from "./popover-position"

// inject the script that will provide window.nostr
let script = document.createElement("script")
script.setAttribute("async", "false")
script.setAttribute("type", "text/javascript")
script.setAttribute("src", browser.runtime.getURL("src/injection/index.js"))
document.head.appendChild(script)

// listen for messages from that script
window.addEventListener("message", async windowMsg => {
  const res = messageModuleCall.safeParse(windowMsg.data)

  if (windowMsg.source !== window || !res.success) return

  const activeElement = document.activeElement

  const message = res.data

  const msg: MessageModuleCall = {
    type: "methodCall",
    id: message.id,
    module: message.module,
    method: message.method,
    params: message.params,
    windowPos: [
      window.innerWidth - 20 - promptHeight,
      window.innerHeight - 20 - promptWidth,
    ],
  }

  if (activeElement && isInteractiveElement(activeElement)) {
    const rect = activeElement.getBoundingClientRect()

    const pos = calculateOptimalPopoverPosition(
      rect,
      { width: promptWidth, height: promptHeight },
      20,
    )

    msg.windowPos = [
      pos.left + window.screenX + (window.outerWidth - window.innerWidth),
      pos.top + window.screenY + (window.outerHeight - window.innerHeight),
    ]
  }

  // pass on to background
  let response

  try {
    response = await sendExtensionMessage(msg)
  } catch (error) {
    response = { success: false, message: (error as Error).message }
  }

  // return response
  postWindowMessage({ request: msg, response }, windowMsg.origin)
})

// Whether we should send the client rect to the worker
const isInteractiveElement = (element: Element) => {
  if (!element) return false

  const tagName = element.tagName.toLowerCase()
  const focusableTags = ["input", "button", "a", "textarea", "select"]

  const hasTabIndex = element.hasAttribute("tabindex")
  const isContentEditable = element.hasAttribute("contenteditable")
  const roleButtonOrLink = ["button", "link"].includes(
    element.getAttribute("role") ?? "",
  )

  return (
    focusableTags.includes(tagName) ||
    hasTabIndex ||
    isContentEditable ||
    roleButtonOrLink
  )
}
