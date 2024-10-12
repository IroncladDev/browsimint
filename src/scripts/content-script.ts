import browser from "webextension-polyfill";
import { WindowMessage } from "../providers";

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
  var response;
  try {
    const msg: WindowMessage = {
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
      const pos = calcBestPosition(rect);
      msg.window = [
        pos.x + window.screenX + (window.outerWidth - window.innerWidth),
        pos.y + window.screenY + (window.outerHeight - window.innerHeight),
      ];
    }

    response = await browser.runtime.sendMessage(msg);
  } catch (error) {
    response = { success: false, message: (error as Error).message };
  }

  console.log(response, "RESPONSE");

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
const popupHeight = 240;
const padding = 20; // Distance from the rect

const calcBestPosition = (rect: DOMRect) => {
  // Get viewable area
  const viewWidth = window.innerWidth;
  const viewHeight = window.innerHeight;

  // Centers of the rect and screen
  const rectCenterY = rect.top + rect.height / 2;
  const screenCenterY = viewHeight / 2;

  let x, y;

  // Plonk x position logic in here
  if (rect.right + padding + popupWidth <= viewWidth) {
    x = rect.right + padding;
  } else if (rect.left - popupWidth - padding >= 0) {
    x = rect.left - popupWidth - padding;
  } else {
    x = Math.max(0, viewWidth - popupWidth); // At least on-screen
  }

  // Align logic by comparing rectCenterY to screenCenterY
  if (rectCenterY < screenCenterY) {
    // Center is closer to top half
    if (rect.top - popupHeight - padding >= 0) {
      y = rect.top - popupHeight - padding;
    } else {
      y = rect.bottom + padding; // Otherwise below
    }
  } else {
    // Center is someplace lower than screen center
    if (rect.bottom + padding + popupHeight <= viewHeight) {
      y = rect.bottom + padding;
    } else {
      y = Math.max(0, viewHeight - popupHeight);
    }
  }

  return { x, y };
};
