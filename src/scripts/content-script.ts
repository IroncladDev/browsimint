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

  // pass on to background
  var response;
  try {
    const msg: WindowMessage = {
      id: message.data.id,
      ext: "fedimint-web",
      module: message.data.module,
      method: message.data.method,
      params: message.data.params,
    };

    response = await browser.runtime.sendMessage(msg);
  } catch (error) {
    response = { error };
  }

  // return response
  window.postMessage(
    { id: message.data.id, ext: "fedimint-web", response },
    message.origin
  );
});
