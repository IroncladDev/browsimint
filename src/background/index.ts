import { Mutex } from "async-mutex";
import browser from "webextension-polyfill";
import { ModuleType, ProviderModuleMethods, WindowMessage } from "../providers";
import { PromptMessage } from "../prompt/send-message";
import FedimintProvider from "../providers/fedimint";
import NostrProvider from "../providers/nostr";
import WeblnProvider from "../providers/webln";
import handleFedimintMessage from "./handlers/fedimint";
import handleNostrMessage from "./handlers/nostr";
import handleWeblnMessage from "./handlers/webln";
import { FedimintProviderMethods } from "../providers/fedimint/types";
import { NostrProviderMethods } from "../providers/nostr/types";
import { WeblnProviderMethods } from "../providers/webln/types";

let openPrompt: any = null;
let promptMutex = new Mutex();
let releasePromptMutex = () => {};
let WasmClient: any;
const width = 360;
const height = 400;

class ModifiedURL extends URL {
  constructor(url: string, base?: string | URL) {
    try {
      super(url, base);
    } catch {
      // Web SDK seems to reference itself with the wrong URL
      super(browser.runtime.getURL("src/scripts/background.js"));
    }
  }
}

globalThis.document = {} as any;
// @ts-ignore
globalThis.URL = ModifiedURL;

async function asdf(message: any) {
  const WasmModule = await import("@fedimint/fedimint-client-wasm-web");
  WasmClient = WasmModule.WasmClient;
  console.log("WasmModule", WasmModule);
  // INIT
  await WasmModule.default();

  let open = await WasmClient.open("testnet");

  console.log(open, "OPEN");

  if(!open) {
    open = await WasmClient.join_federation(
      "testnet",
      "fed11qgqrgvnhwden5te0v9k8q6rp9ekh2arfdeukuet595cr2ttpd3jhq6rzve6zuer9wchxvetyd938gcewvdhk6tcqqysptkuvknc7erjgf4em3zfh90kffqf9srujn6q53d6r056e4apze5cw27h75"
    );
  }

  const client = open;

  console.log(client);
  console.log(await client.rpc('', 'get_balance', JSON.stringify({}), console.log), "getBalance");
  console.log(message, "MESSAGE");
}

// self.postMessage({ type: 'init', data: {} })

browser.runtime.onInstalled.addListener(
  ({ reason }: browser.Runtime.OnInstalledDetailsType) => {
    if (reason === "install") {
      browser.action.openPopup();
    }
  }
);

browser.runtime.onMessage.addListener(async (message, sender) => {
  asdf(message);

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

browser.runtime.onMessageExternal.addListener(async (message) => {
  try {
    const res = await handleContentScriptMessage(message);

    return { success: true, data: res };
  } catch (err) {
    return { success: false, message: (err as Error).message };
  }
});

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
      method: message.method,
    });

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
        width,
        height,
        top: Math.round(message.window[1]),
        left: Math.round(message.window[0]),
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
