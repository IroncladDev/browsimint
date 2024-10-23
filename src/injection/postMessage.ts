import { ModuleMethodCall, WindowModuleKind } from "../types";
import { PromiseQueue } from "./queue";

const queue = new PromiseQueue();

export function postMessage<
  U extends { [key: string]: [any, any] },
  T extends keyof U
>(method: T, params: U[T][0], module: WindowModuleKind): Promise<U[T][1]> {
  return queue.add(
    () =>
      new Promise((resolve, reject) => {
        const id = Math.random().toString().slice(2);

        const message: ModuleMethodCall = {
          type: "methodCall",
          id,
          ext: "fedimint-web",
          module,
          method: method as string,
          params,
          windowPos: [0, 0],
        };

        window.postMessage(message, "*");

        function handleWindowMessage(messageEvent: MessageEvent) {
          if (
            !messageEvent.data ||
            !messageEvent.data.response ||
            messageEvent.data.ext !== "fedimint-web" ||
            messageEvent.data.id !== id
          ) {
            return;
          }

          if (messageEvent.data.response.success) {
            resolve(messageEvent.data.response.data);
          } else {
            reject(new Error(messageEvent.data.response.message));
          }

          window.removeEventListener("message", handleWindowMessage);
        }

        window.addEventListener("message", handleWindowMessage as any);
      })
  );
}
