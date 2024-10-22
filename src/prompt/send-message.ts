import browser from "webextension-polyfill";
import { PromptMessage } from "../types";

export function approveRequest(params: any) {
  const message: PromptMessage = {
    type: "prompt",
    ext: "fedimint-web",
    prompt: true,
    accept: true,
    params
  };

  browser.runtime.sendMessage(message);
}

export function denyRequest() {
  const message: PromptMessage = {
    type: "prompt",
    ext: "fedimint-web",
    prompt: true,
    accept: false,
  };
  browser.runtime.sendMessage(message);
}
