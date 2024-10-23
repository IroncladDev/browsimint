import { Mutex } from "async-mutex";
import browser from "webextension-polyfill";
import {
  ModuleMethodCall,
  PermissionLevel,
  PromptMessage,
  PromptMessageAccepted,
  WindowMessage,
} from "../types";
import handleFedimintMessage, { FedimintParams } from "./handlers/fedimint";
import handleNostrMessage, { NostrParams } from "./handlers/nostr";
import handleWeblnMessage, { WeblnParams } from "./handlers/webln";
import { FedimintWallet } from "@fedimint/core-web";
import handleInternalMessage from "./handlers/internal";
import { permissions } from "../lib/constants";
import {
  FederationItemSchema,
  federationSchema,
  LocalStore,
} from "../lib/storage";

let openPrompt: {
  resolve: (reason: PromptMessage) => void;
  reject: () => void;
} | null = null;
let promptMutex = new Mutex();
let releasePromptMutex = () => {};
let wallet = new FedimintWallet();
const width = 360;
const height = 400;

wallet.setLogLevel("debug");

browser.storage.onChanged.addListener(async function (changes) {
  for (const item in changes) {
    const { oldValue, newValue } = changes[item];

    switch (item) {
      case "activeFederation":
        if (oldValue !== newValue) {
          if (wallet.isOpen()) {
            await wallet.cleanup();
            wallet = new FedimintWallet();

            wallet.setLogLevel("debug");

            await wallet.open(newValue);
          } else {
            await wallet.open();
          }
        }
        break;
      case "federations":
        const existingFeds: Array<FederationItemSchema> = oldValue ?? [];
        const newFeds: Array<FederationItemSchema> = newValue ?? [];

        let newFederations = newFeds;

        if (existingFeds.length < newFeds.length) {
          if (existingFeds.length === 0) {
            await LocalStore.setKey("activeFederation", newFeds[0].id);
          }

          newFederations = newFeds.filter(
            (f: FederationItemSchema) =>
              !existingFeds.some((x: FederationItemSchema) => x.id === f.id)
          );
        } else {
          const activeFed = await LocalStore.getActiveFederation();

          if (
            !newFeds.some((x: FederationItemSchema) => x.id === activeFed?.id)
          ) {
            await LocalStore.setKey("activeFederation", newFeds[0].id);
          }
        }

        newFederations = newFederations.filter(
          (x) => federationSchema.safeParse(x).success
        );

        await Promise.all(
          newFederations.map((fed) => wallet.joinFederation(fed.invite, fed.id))
        );

        await LocalStore.joinFederations(newFederations);
    }
    break;
  }
});

browser.runtime.onInstalled.addListener(
  ({ reason }: browser.Runtime.OnInstalledDetailsType) => {
    if (reason === "install") {
      browser.action.openPopup();
    }
  }
);

browser.runtime.onMessage.addListener(
  async (message: WindowMessage, sender) => {
    if (message.ext !== "fedimint-web") return;

    try {
      if (message.type === "prompt") {
        handlePromptMessage(message, sender);
      } else if (message.type === "methodCall") {
        const res = await handleContentScriptMessage(message);

        return { success: true, data: res };
      } else if (message.type === "internalCall") {
        const res = await handleInternalMessage(message);

        return { success: true, data: res };
      }
    } catch (err) {
      return { success: false, message: (err as Error).message };
    }
  }
);

browser.runtime.onMessageExternal.addListener(
  async (message: WindowMessage) => {
    if (message.ext !== "fedimint-web") return;

    try {
      if (message.type === "methodCall") {
        const res = await handleContentScriptMessage(message);

        return { success: true, data: res };
      } else if (message.type === "internalCall") {
        const res = await handleInternalMessage(message);

        return { success: true, data: res };
      }
    } catch (err) {
      return { success: false, message: (err as Error).message };
    }
  }
);

async function handleContentScriptMessage(message: ModuleMethodCall) {
  // acquire mutex here before reading policies
  releasePromptMutex = await promptMutex.acquire();

  let handlerParams = message.params;

  const activeFederation = await LocalStore.getActiveFederation();

  if (activeFederation && !wallet.isOpen()) {
    await wallet.open(activeFederation.id);
  }

  try {
    let qs = new URLSearchParams({
      params: JSON.stringify(message.params),
      module: message.module,
      method: message.method,
    });

    // prompt will be resolved with true or false
    let result = await new Promise<PromptMessage>(async (resolve, reject) => {
      const permissionLevel = permissions[message.module][message.method];

      if (permissionLevel === PermissionLevel.None) {
        releasePromptMutex();
        openPrompt = null;
        resolve({
          type: "prompt",
          ext: "fedimint-web",
          prompt: true,
          accept: true,
          method: message.method as PromptMessageAccepted["method"],
          params: message.params,
        });

        return;
      }
      // TODO: payment/signature event strictness

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
          resolve({
            type: "prompt",
            ext: "fedimint-web",
            prompt: true,
            accept: false,
            method: message.method as PromptMessageAccepted["method"],
          });
          browser.windows.onRemoved.removeListener(listenForClose);
        }
      }

      browser.windows.onRemoved.addListener(listenForClose);
    });

    // TODO: better error handling
    if (!result.accept) throw new Error("denied");

    handlerParams = result.params;
  } catch (err) {
    releasePromptMutex();

    throw new Error((err as Error).message);
  }

  if (message.module === "fedimint") {
    return await handleFedimintMessage(
      {
        method: message.method as FedimintParams["method"],
        params: handlerParams,
      },
      wallet
    );
  } else if (message.module === "nostr") {
    return await handleNostrMessage({
      method: message.method as NostrParams["method"],
      params: handlerParams,
    });
  } else if (message.module === "webln") {
    return await handleWeblnMessage(
      {
        method: message.method as WeblnParams["method"],
        params: handlerParams,
      },
      wallet
    );
  }
}

async function handlePromptMessage(message: PromptMessage, sender: any) {
  if (!message.accept) return;

  openPrompt?.resolve?.(message);

  openPrompt = null;

  releasePromptMutex();

  if (sender) {
    browser.windows.remove(sender.tab.windowId);
  }
}
