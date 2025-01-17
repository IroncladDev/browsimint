import { messageInternalCall } from "@common/schemas"
import { LocalStore } from "@common/storage"
import { MessageInternalCall } from "@common/types"
import {
  Duration,
  GatewayInfo,
  JSONObject,
  LnReceiveState,
} from "@fedimint/core-web"
import { wallet } from "../state"

export default async function handleInternalMessage(msg: MessageInternalCall) {
  const { method, params } = messageInternalCall.parse(msg)

  const activeFederation = await LocalStore.getActiveFederation()

  if (activeFederation && !wallet.isOpen()) {
    await wallet.open(activeFederation.id)
  }

  switch (method) {
    case "payInvoice":
      return await wallet.lightning.payInvoice(
        params.invoice,
        params.gatewayInfo,
        params.extraMeta,
      )
    case "createInvoice":
      return await wallet.lightning.createInvoice(
        params.amount,
        params.description,
        params.expiryTime,
        params.extraMeta,
        params.gatewayInfo,
      )
    case "spendEcash":
      return await wallet.mint.spendNotes(
        params.minAmount,
        params.tryCancelAfter,
        params.includeInvite,
        params.extraMeta,
      )
    case "redeemEcash":
      await wallet.mint.redeemEcash(params.notes)

      return await wallet.mint.parseNotes(params.notes)
    case "awaitInvoice":
      return await new Promise<LnReceiveState>((resolve, reject) => {
        const unsubscribe = wallet.lightning.subscribeLnReceive(
          params.operationId,
          res => {
            if (res === "claimed") {
              unsubscribe()
              resolve(res)
            }
          },
          err => {
            unsubscribe()
            reject(err)
          },
        )
      })
    case "checkInvite":
      await wallet.federation.getConfig()
  }
}

export type InternalParams =
  | {
      method: "payInvoice"
      params: {
        invoice: string
        gatewayInfo?: GatewayInfo
        extraMeta?: JSONObject
      }
    }
  | {
      method: "createInvoice"
      params: {
        amount: number
        description: string
        expiryTime?: number
        extraMeta?: JSONObject
        gatewayInfo?: GatewayInfo
      }
    }
  | {
      method: "spendEcash"
      params: {
        minAmount: number
        tryCancelAfter?: number | Duration
        includeInvite?: boolean
        extraMeta?: JSONObject
      }
    }
  | {
      method: "redeemEcash"
      params: {
        notes: string
      }
    }
  | {
      method: "awaitInvoice"
      params: {
        operationId: string
      }
    }
