import browser from "webextension-polyfill";
import {
  PromptMessageAccepted,
  PromptMessageRejected,
} from "../types";

export function approveRequest({
  params,
  method,
}: Pick<PromptMessageAccepted, "method" | "params">) {
  const message: PromptMessageAccepted = {
    type: "prompt",
    ext: "fedimint-web",
    prompt: true,
    accept: true,
    params: params as PromptMessageAccepted["params"],
    method: method as any,
  };

  browser.runtime.sendMessage(message);
}

export function denyRequest({ method }: Pick<PromptMessageRejected, "method">) {
  const message: PromptMessageRejected = {
    type: "prompt",
    ext: "fedimint-web",
    prompt: true,
    accept: false,
    method,
  };
  browser.runtime.sendMessage(message);
}
