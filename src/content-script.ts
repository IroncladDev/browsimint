import browser from "webextension-polyfill";
import { ModuleMethodCall, WindowMessage } from "./providers";

// inject the script that will provide window.nostr
let script = document.createElement("script");
script.setAttribute("async", "false");
script.setAttribute("type", "text/javascript");
script.setAttribute("src", browser.runtime.getURL("src/providers/index.js"));
document.head.appendChild(script);

// listen for messages from that script
window.addEventListener("message", async (message) => {
  if (message.source !== window) return;

  if (!message.data) return;

  if (!message.data.params) return;

  if (message.data.ext !== "fedimint-web") return;

  const activeElement = document.activeElement;

  let rect: DOMRect | null = null;

  if (activeElement && isInteractiveElement(activeElement)) {
    rect = activeElement.getBoundingClientRect();
  }

  // pass on to background
  let response;

  try {
    const msg: ModuleMethodCall = {
      type: "methodCall",
      id: message.data.id,
      ext: "fedimint-web",
      module: message.data.module,
      method: message.data.method,
      params: message.data.params,
      window: [
        window.innerWidth / 2 - popupWidth / 2,
        window.innerHeight / 2 - popupHeight / 2,
      ],
    };

    if (rect) {
      const pos = getPopoverPlacement(rect);
      msg.window = [
        pos.left + window.screenX + (window.outerWidth - window.innerWidth),
        pos.top + window.screenY + (window.outerHeight - window.innerHeight),
      ];
    }

    response = await browser.runtime.sendMessage(msg);
  } catch (error) {
    response = { success: false, message: (error as Error).message };
  }

  // return response
  window.postMessage(
    { id: message.data.id, ext: "fedimint-web", response },
    message.origin
  );
});

// Whether we should send the client rect to the worker
const isInteractiveElement = (element: Element) => {
  if (!element) return false;

  const tagName = element.tagName.toLowerCase();
  const focusableTags = ["input", "button", "a", "textarea", "select"];

  const hasTabIndex = element.hasAttribute("tabindex");
  const isContentEditable = element.hasAttribute("contenteditable");
  const roleButtonOrLink = ["button", "link"].includes(
    element.getAttribute("role") ?? ""
  );

  return (
    focusableTags.includes(tagName) ||
    hasTabIndex ||
    isContentEditable ||
    roleButtonOrLink
  );
};

const popupWidth = 360;
const popupHeight = 400;
const padding = 20;

interface Placement {
  top: number;
  left: number;
}

function getPopoverPlacement(elementRect: DOMRect): Placement {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Calculate available space around the element
  const spaceAbove = elementRect.top - padding;
  const spaceBelow =
    viewportHeight - (elementRect.top + elementRect.height + padding);
  const spaceLeft = elementRect.left - padding;
  const spaceRight =
    viewportWidth - (elementRect.left + elementRect.width + padding);

  // Determine the best placement based on available space
  let top: number;
  let left: number;

  // Prioritize side-by-side placement
  if (spaceLeft >= popupWidth) {
    // Place to the left of the element
    top = Math.max(
      padding,
      Math.min(
        elementRect.top + (elementRect.height - popupHeight) / 2,
        viewportHeight - popupHeight - padding
      )
    );
    left = elementRect.left - popupWidth - padding;
  } else if (spaceRight >= popupWidth) {
    // Place to the right of the element
    top = Math.max(
      padding,
      Math.min(
        elementRect.top + (elementRect.height - popupHeight) / 2,
        viewportHeight - popupHeight - padding
      )
    );
    left = elementRect.left + elementRect.width + padding;
  } else if (spaceAbove >= popupHeight) {
    // Place above the element if no side space is available
    top = elementRect.top - popupHeight - padding;
    left = Math.max(
      padding,
      Math.min(
        elementRect.left + (elementRect.width - popupWidth) / 2,
        viewportWidth - popupWidth - padding
      )
    );
  } else if (spaceBelow >= popupHeight) {
    // Place below the element if no side or top space is available
    top = elementRect.top + elementRect.height + padding;
    left = Math.max(
      padding,
      Math.min(
        elementRect.left + (elementRect.width - popupWidth) / 2,
        viewportWidth - popupWidth - padding
      )
    );
  } else {
    // Default to top if no other space is available
    top = elementRect.top - popupHeight - padding;
    left = Math.max(
      padding,
      Math.min(
        elementRect.left + (elementRect.width - popupWidth) / 2,
        viewportWidth - popupWidth - padding
      )
    );
  }

  return { top, left };
}
