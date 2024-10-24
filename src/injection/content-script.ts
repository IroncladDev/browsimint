import { EXTENSION_NAME } from "@/common/constants"
import { messageModuleCall } from "@/common/schemas/messages"
import { sendExtensionMessage } from "@common/messaging/extension"
import { postWindowMessage } from "@common/messaging/window"
import { MessageModuleCall } from "@common/types"
import browser from "webextension-polyfill"

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

  let rect: DOMRect | null = null

  if (activeElement && isInteractiveElement(activeElement)) {
    rect = activeElement.getBoundingClientRect()
  }

  // pass on to background
  let response

  const message = res.data

  const msg: MessageModuleCall = {
    type: "methodCall",
    id: message.id,
    ext: EXTENSION_NAME,
    module: message.module,
    method: message.method,
    params: message.params,
    windowPos: [
      window.innerWidth / 2 - popupWidth / 2,
      window.innerHeight / 2 - popupHeight / 2,
    ],
  }

  try {
    if (rect) {
      const pos = getPopoverPlacement(rect)
      msg.windowPos = [
        pos.left + window.screenX + (window.outerWidth - window.innerWidth),
        pos.top + window.screenY + (window.outerHeight - window.innerHeight),
      ]
    }

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

const popupWidth = 360
const popupHeight = 400
const padding = 20

interface Placement {
  top: number
  left: number
}

function getPopoverPlacement(elementRect: DOMRect): Placement {
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight

  // Calculate available space around the element
  const spaceAbove = elementRect.top - padding
  const spaceBelow =
    viewportHeight - (elementRect.top + elementRect.height + padding)
  const spaceLeft = elementRect.left - padding
  const spaceRight =
    viewportWidth - (elementRect.left + elementRect.width + padding)

  // Determine the best placement based on available space
  let top: number
  let left: number

  // Prioritize side-by-side placement
  if (spaceLeft >= popupWidth) {
    // Place to the left of the element
    top = Math.max(
      padding,
      Math.min(
        elementRect.top + (elementRect.height - popupHeight) / 2,
        viewportHeight - popupHeight - padding,
      ),
    )
    left = elementRect.left - popupWidth - padding
  } else if (spaceRight >= popupWidth) {
    // Place to the right of the element
    top = Math.max(
      padding,
      Math.min(
        elementRect.top + (elementRect.height - popupHeight) / 2,
        viewportHeight - popupHeight - padding,
      ),
    )
    left = elementRect.left + elementRect.width + padding
  } else if (spaceAbove >= popupHeight) {
    // Place above the element if no side space is available
    top = elementRect.top - popupHeight - padding
    left = Math.max(
      padding,
      Math.min(
        elementRect.left + (elementRect.width - popupWidth) / 2,
        viewportWidth - popupWidth - padding,
      ),
    )
  } else if (spaceBelow >= popupHeight) {
    // Place below the element if no side or top space is available
    top = elementRect.top + elementRect.height + padding
    left = Math.max(
      padding,
      Math.min(
        elementRect.left + (elementRect.width - popupWidth) / 2,
        viewportWidth - popupWidth - padding,
      ),
    )
  } else {
    // Default to top if no other space is available
    top = elementRect.top - popupHeight - padding
    left = Math.max(
      padding,
      Math.min(
        elementRect.left + (elementRect.width - popupWidth) / 2,
        viewportWidth - popupWidth - padding,
      ),
    )
  }

  return { top, left }
}
