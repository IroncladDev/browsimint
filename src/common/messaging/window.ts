import { MessageModuleCall, WindowAck } from "../types"

export function postWindowMessage(
  msg: MessageModuleCall | WindowAck,
  origin: string,
) {
  // windowMessageSchema.parse(msg)
  console.log(msg, "AAAAAAAAAAAAAAAAAAA")

  return window.postMessage(msg, origin)
}
