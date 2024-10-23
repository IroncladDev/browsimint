import { InternalCall } from "../types";
import browser from "webextension-polyfill";

export async function makeInternalCall<T>({
  params,
  method,
}: Pick<InternalCall, "method" | "params">): Promise<
  { success: true; data: T } | { success: false; message: string }
> {
  const message: InternalCall = {
    type: "internalCall",
    ext: "fedimint-web",
    params: params as any,
    method: method as any,
  };

  return await browser.runtime.sendMessage(message);
}
