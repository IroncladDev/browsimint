import { Mutex } from "async-mutex";
import browser from "webextension-polyfill";
import { ModuleType, ProviderModuleMethods, WindowMessage } from "../providers";
import { PromptMessage } from "../pages/prompt/send-message";
import FedimintProvider from "../providers/fedimint";
import NostrProvider from "../providers/nostr";
import WeblnProvider from "../providers/webln";
import handleFedimintMessage from "./handlers/fedimint";
import handleNostrMessage from "./handlers/nostr";
import handleWeblnMessage from "./handlers/webln";
import { FedimintProviderMethods } from "../providers/fedimint/types";
import { NostrProviderMethods } from "../providers/nostr/types";
import { WeblnProviderMethods } from "../providers/webln/types";
import { FedimintWallet } from "@fedimint/core-web";

let openPrompt: any = null;
let promptMutex = new Mutex();
let releasePromptMutex = () => {};
const width = 340;
const height = 360;

let fedimint = new FedimintWallet();

(async () => {
  const isOpen = await fedimint.open("testnet");

  if (!isOpen) {
    await fedimint.joinFederation(
      "fed11qgqrgvnhwden5te0v9k8q6rp9ekh2arfdeukuet595cr2ttpd3jhq6rzve6zuer9wchxvetyd938gcewvdhk6tcqqysptkuvknc7erjgf4em3zfh90kffqf9srujn6q53d6r056e4apze5cw27h75",
      "testnet"
    );
  }

  // TODO: clear storage and remove
  // if (
  //   (await browser.storage.local.get("activeFederationId"))
  //     .activeFederationId !== "testnet"
  // ) {
  //   browser.storage.local.set({
  //     activeFederationId: "testnet",
  //     federationIds: JSON.stringify(["testnet"]),
  //   });
  // }
})();

// Update the wallet when the storage changes
// browser.storage.onChanged.addListener(async (changes, namespace) => {
//   if (namespace === "local") {
//     for (let [key, { newValue }] of Object.entries(changes)) {
//       if (key === "activeFederationId") {
//         await fedimint.cleanup();
//         fedimint = new FedimintWallet();
//         await fedimint.open(newValue);
//       }
//     }
//   }
// });

browser.runtime.onInstalled.addListener(
  ({ reason }: browser.Runtime.OnInstalledDetailsType) => {
    if (reason === "install") {
      browser.action.openPopup();
    }
  }
);

browser.runtime.onMessage.addListener(async (message, sender) => {
  let { prompt } = message;

  try {
    if (prompt) {
      handlePromptMessage(message, sender);
    } else {
      const res = await handleContentScriptMessage(message);

      return { success: true, data: res };
    }
  } catch (err) {
    return { success: false, message: (err as Error).message };
  }
});

browser.runtime.onMessageExternal.addListener(
  async ({ module, method, params }, sender) => {
    if (!sender.url) return;

    try {
      const res = await handleContentScriptMessage({
        method,
        params,
        module,
        ext: "fedimint-web",
      });

      return { success: true, data: res };
    } catch (err) {
      return { success: false, message: (err as Error).message };
    }
  }
);

const modulePermissions: Record<
  ModuleType,
  Record<keyof ProviderModuleMethods<ModuleType>, 0 | 1 | 2>
> = {
  fedimint: FedimintProvider.permissions,
  nostr: NostrProvider.permissions,
  webln: WeblnProvider.permissions,
};

async function handleContentScriptMessage(message: WindowMessage) {
  // acquire mutex here before reading policies
  releasePromptMutex = await promptMutex.acquire();

  try {
    let qs = new URLSearchParams({
      params: JSON.stringify(message.params),
      module: message.module,
    });

    // center prompt
    const { top, left } = await getPosition(width, height);

    // prompt will be resolved with true or false
    let accept = await new Promise(async (resolve, reject) => {
      const currentPermission =
        modulePermissions[message.module][
          message.method as keyof ProviderModuleMethods<ModuleType>
        ];

      if (currentPermission === 0) {
        releasePromptMutex();
        openPrompt = null;
        resolve(true);

        return;
        // TODO: maybe do permission levels
      }

      openPrompt = { resolve, reject };

      const win = await browser.windows.create({
        url: `${browser.runtime.getURL("src/prompt.html")}?${qs.toString()}`,
        type: "popup",
        width: width,
        height: height,
        top: top,
        left: left,
      });

      function listenForClose(id?: number) {
        if (id === win.id) {
          resolve(false);
          browser.windows.onRemoved.removeListener(listenForClose);
        }
      }

      browser.windows.onRemoved.addListener(listenForClose);
    });

    // TODO: better error handling
    if (!accept) throw new Error("denied");
  } catch (err) {
    releasePromptMutex();

    throw new Error((err as Error).message);
  }

  if (message.module === "fedimint") {
    return await handleFedimintMessage(
      message.method as keyof FedimintProviderMethods,
      message.params
    );
  } else if (message.module === "nostr") {
    return await handleNostrMessage(
      message.method as keyof NostrProviderMethods,
      message.params
    );
  } else if (message.module === "webln") {
    return await handleWeblnMessage(
      message.method as keyof WeblnProviderMethods,
      message.params
    );
  }
}

async function handlePromptMessage(message: PromptMessage, sender: any) {
  openPrompt?.resolve?.(message.accept);

  openPrompt = null;

  releasePromptMutex();

  if (sender) {
    browser.windows.remove(sender.tab.windowId);
  }
}

// TODO: open around element
async function getPosition(width: number, height: number) {
  let left = 0;
  let top = 0;

  try {
    const lastFocused = await browser.windows.getLastFocused();

    if (
      lastFocused &&
      lastFocused.top !== undefined &&
      lastFocused.left !== undefined &&
      lastFocused.width !== undefined &&
      lastFocused.height !== undefined
    ) {
      // Position window in the center of the lastFocused window
      top = Math.round(lastFocused.top + (lastFocused.height - height) / 2);
      left = Math.round(lastFocused.left + (lastFocused.width - width) / 2);
    } else {
      console.error("Last focused window properties are undefined.");
    }
  } catch (error) {
    console.error("Error getting window position:", error);
  }

  return {
    top,
    left,
  };
}
 
export { fedimint };
