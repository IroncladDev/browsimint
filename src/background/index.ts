import { Mutex } from "async-mutex";
import browser from "webextension-polyfill";
import {
  ModuleMethodCall,
  ModuleType,
  ProviderModuleMethods,
  WindowMessage,
} from "../providers";
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
import { FedimintWallet } from "@fedimint/core-web";

let openPrompt: any = null;
let promptMutex = new Mutex();
let releasePromptMutex = () => {};
let wallet: FedimintWallet | null = null;
const width = 360;
const height = 400;

async function initWallet() {
  const wal = new FedimintWallet();

  let open = await wal.open("testnet");

  if (!open) {
    await wal.joinFederation(
      "fed11qgqzc2nhwden5te0vejkg6tdd9h8gepwvejkg6tdd9h8garhduhx6at5d9h8jmn9wshxxmmd9uqqzgxg6s3evnr6m9zdxr6hxkdkukexpcs3mn7mj3g5pc5dfh63l4tj6g9zk4er",
      "testnet"
    );
  }

  wallet = wal;
}

browser.runtime.onInstalled.addListener(
  ({ reason }: browser.Runtime.OnInstalledDetailsType) => {
    if (reason === "install") {
      browser.action.openPopup();
    }
  }
);

browser.runtime.onMessage.addListener(
  async (message: WindowMessage, sender) => {
    if (!wallet) await initWallet();
    else {
      console.log("WALLET INITIALIZED", wallet);
    }

    try {
      if (message.type === "prompt") {
        handlePromptMessage(message, sender);
      } else if (message.type === "methodCall") {
        const res = await handleContentScriptMessage(
          message as ModuleMethodCall
        );

        return { success: true, data: res };
      }
    } catch (err) {
      return { success: false, message: (err as Error).message };
    }
  }
);

browser.runtime.onMessageExternal.addListener(
  async (message: WindowMessage) => {
    try {
      if (message.type === "methodCall") {
        const res = await handleContentScriptMessage(
          message as ModuleMethodCall
        );

        return { success: true, data: res };
      }
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

async function handleContentScriptMessage(message: ModuleMethodCall) {
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
