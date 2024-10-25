import { messageModuleCall, windowAck } from "@common/schemas"
import { z } from "zod"

const windowMessageSchema = z.union([messageModuleCall, windowAck])

type WindowMessage = z.infer<typeof windowMessageSchema>

export function postWindowMessage(
  msg: WindowMessage,
  origin: string,
) {
  windowMessageSchema.parse(msg)

  return window.postMessage(msg, origin)
}
