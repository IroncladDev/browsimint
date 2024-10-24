import { messageModuleCall, windowAck } from "@/lib/schemas/messages"
import { MessageModuleCall, WindowAck } from "@/types"
import { z } from "zod"

export function postWindowMessage(
  msg: MessageModuleCall | WindowAck,
  origin: string,
) {
  z.union([messageModuleCall, windowAck]).parse(msg)

  return window.postMessage(msg, origin)
}
