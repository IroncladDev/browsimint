import { postWindowMessage } from "../lib/messaging/window"
import { messageModuleCall } from "../lib/schemas/messages"
import { MessageModuleCall, WindowModuleKind } from "../types"
import { PromiseQueue } from "./queue"

const queue = new PromiseQueue()

export function postMessage(
  method: string,
  params: any,
  module: WindowModuleKind,
): Promise<any> {
  return queue.add(
    () =>
      new Promise((resolve, reject) => {
        const id = Math.random().toString().slice(2)

        postWindowMessage(
          {
            type: "methodCall",
            id,
            ext: "fedimint-web",
            module,
            method,
            params,
            windowPos: [0, 0],
          },
          "*",
        )

        function handleWindowMessage(
          messageEvent: MessageEvent<{
            request: MessageModuleCall
            response:
              | { success: false; message: string }
              | { success: true; data: any }
          }>,
        ) {
          if (!messageEvent.data || !messageEvent.data.response) {
            return
          }

          const { success: isValid } = messageModuleCall.safeParse(
            messageEvent.data.request,
          )

          if (!isValid) return

          if (messageEvent.data.response.success) {
            resolve(messageEvent.data.response.data)
          } else {
            reject(new Error(messageEvent.data.response.message))
          }

          window.removeEventListener("message", handleWindowMessage)
        }

        window.addEventListener("message", handleWindowMessage)
      }),
  )
}
