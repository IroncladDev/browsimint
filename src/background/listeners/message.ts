import { initWallet } from "..";
import { permissions, promptHeight, promptWidth } from "../../lib/constants";
import {
  BalanceUpdate,
  ModuleMethodCall,
  PermissionLevel,
  PromptMessage,
  WindowMessage,
} from "../../types";
import handleFedimintMessage, { FedimintParams } from "../handlers/fedimint";
import handleInternalMessage from "./internal";
import handleNostrMessage, { NostrParams } from "../handlers/nostr";
import handleWeblnMessage, { WeblnParams } from "../handlers/webln";
import {
  openPrompt,
  promptMutex,
  releasePromptMutex,
  setReleasePromptMutex,
  setWindowPrompt,
  wallet,
} from "../state";
import browser from "webextension-polyfill";

export async function handleMessage(message: WindowMessage, sender: any) {
  if (message.ext !== "fedimint-web") return;

  try {
    switch (message.type) {
      case "prompt":
        if (!message.accept || !openPrompt) return;

        openPrompt.resolve(message);
        setWindowPrompt(null);
        releasePromptMutex();

        if (sender) {
          browser.windows.remove(sender.tab.windowId);
        }
        break;
      case "methodCall":
        const methodRes = await handleContentScriptMessage(message);

        return { success: true, data: methodRes };
      case "internalCall":
        const internalRes = await handleInternalMessage(message);

        return { success: true, data: internalRes };
      case "balanceRequest":
        if (wallet.isOpen()) {
          browser.runtime.sendMessage({
            ext: "fedimint-web",
            type: "balance",
            balance: await wallet.balance.getBalance(),
          } as BalanceUpdate);
        }
      default:
        return;
    }
  } catch (err) {
    return { success: false, message: (err as Error).message };
  }
}

async function handleContentScriptMessage({
  module,
  method,
  windowPos,
  params: messageParams,
}: ModuleMethodCall) {
  // Prompt URL may change original params (e.g. webln.creatInvoice)
  let params = messageParams;

  try {
    await initWallet();

    let result = {
      type: "prompt",
      ext: "fedimint-web",
      prompt: true,
      accept: true,
      method,
      params,
    } as PromptMessage;

    if (permissions[module][method] !== PermissionLevel.None) {
      setReleasePromptMutex(await promptMutex.acquire());

      result = await new Promise<PromptMessage>(async (resolve, reject) => {
        setWindowPrompt({ resolve, reject });

        let queryParams = new URLSearchParams({
          params: JSON.stringify(params),
          module,
          method,
        });

        const win = await browser.windows.create({
          url: `${browser.runtime.getURL(
            "src/prompt.html"
          )}?${queryParams.toString()}`,
          type: "popup",
          width: promptWidth,
          height: promptHeight,
          top: Math.round(windowPos[1]),
          left: Math.round(windowPos[0]),
        });

        function listenForClose(id?: number) {
          if (id === win.id) {
            resolve({
              type: "prompt",
              ext: "fedimint-web",
              prompt: true,
              accept: false,
              method,
            } as PromptMessage);
            browser.windows.onRemoved.removeListener(listenForClose);
          }
        }

        browser.windows.onRemoved.addListener(listenForClose);
      });
    }

    // TODO: better error handling
    if (!result.accept) throw new Error("denied");

    params = result.params;
  } catch (err) {
    releasePromptMutex();

    throw new Error((err as Error).message);
  }

  if (module === "fedimint") {
    return await handleFedimintMessage(
      {
        method,
        params,
      } as FedimintParams,
      wallet
    );
  } else if (module === "nostr") {
    return await handleNostrMessage({
      method,
      params,
    } as NostrParams);
  } else if (module === "webln") {
    return await handleWeblnMessage(
      {
        method,
        params,
      } as WeblnParams,
      wallet
    );
  }
}
