import browser from "webextension-polyfill";

export type PromptMessage = {
  prompt: true;
  accept: boolean;
};

export function approveRequest() {
  const message: PromptMessage = {
    prompt: true,
    accept: true,
  };

  browser.runtime.sendMessage(message);
}

export function denyRequest() {
  const message: PromptMessage = {
    prompt: true,
    accept: false,
  };
  browser.runtime.sendMessage(message);
}
