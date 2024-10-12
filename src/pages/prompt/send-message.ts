import browser from "webextension-polyfill";
import { ModuleType, ProviderModuleMethods } from "../../providers";

export type PromptMessage = {
  ext: "fedimint-web";
  prompt: true;
  accept: boolean;
  module: ModuleType;
  method: string;
  params: any;
};

export function acceptRequest<
  T extends ModuleType,
  U extends keyof ProviderModuleMethods<T>
  // @ts-expect-error
>(module: T, method: U, params: ProviderModuleMethods<T>[U][0]) {
  const message: PromptMessage = {
    ext: "fedimint-web",
    prompt: true,
    accept: true,
    module,
    method: method as string,
    params,
  };

  browser.runtime.sendMessage(message);
}

export function denyRequest<
  T extends ModuleType,
  U extends keyof ProviderModuleMethods<T>
  // @ts-expect-error
>(module: T, method: U, params: ProviderModuleMethods<T>[U][0]) {
  const message: PromptMessage = {
    ext: "fedimint-web",
    prompt: true,
    accept: false,
    module,
    method: method as string,
    params,
  };
  browser.runtime.sendMessage(message);
}
