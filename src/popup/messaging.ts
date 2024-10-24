import { sendExtensionMessage } from "@/lib/messaging/extension"
import { MessageInternalCall } from "@/types"

export async function makeInternalCall<T>({
  params,
  method,
}: Pick<MessageInternalCall, "method" | "params">): Promise<
  { success: true; data: T } | { success: false; message: string }
> {
  return await sendExtensionMessage({
    type: "internalCall",
    ext: "fedimint-web",
    params: params,
    method: method,
  })
}
