import { messageModuleCall, windowAck } from "@common/schemas"
import { MessageModuleCall, WindowAck } from "@common/types"
import { z } from "zod"

export function postWindowMessage(
  msg: MessageModuleCall | WindowAck,
  origin: string,
) {
  z.union([messageModuleCall, windowAck]).parse(msg)

  return window.postMessage(msg, origin)
}
