import { FedimintWallet, GatewayInfo, JSONObject } from "@fedimint/core-web"

export type WeblnParams =
  | {
      method: "getBalance"
      params: undefined
    }
  | {
      method: "makeInvoice"
      params: {
        amount: number
        description: string
        expiryTime?: number
        extraMeta?: JSONObject
        gatewayInfo?: GatewayInfo
      }
    }
  | {
      method: "sendPayment"
      params: {
        paymentRequest: string
        extraMeta?: JSONObject
        gatewayInfo?: GatewayInfo
      }
    }

export default async function handleWeblnMessage(
  { method, params }: WeblnParams,
  wallet: FedimintWallet,
) {
  switch (method) {
    case "getBalance":
      return {
        balance: Math.round((await wallet.balance.getBalance()) / 1000),
        currency: "sats",
      }
    case "makeInvoice":
      return await wallet.lightning.createInvoice(
        params.amount,
        params.description,
        params.expiryTime,
        params.gatewayInfo,
        params.extraMeta,
      )
    case "sendPayment":
      const res = await wallet.lightning.payInvoice(
        params.paymentRequest,
        params.gatewayInfo,
        params.extraMeta,
      )

      const payType = res.payment_type as unknown as
        | { internal: string }
        | { lightning: string }

      return await new Promise<{ preimage: string }>(
        async (resolve, reject) => {
          setTimeout(() => reject(new Error("Timeout")), 10000)

          let unsubscribe: () => void

          if ("internal" in payType) {
            // TODO: actually return preimage
            // This is a workaround for now
            // Does not follow the webln spec
            resolve({ preimage: res.contract_id })

            return
          }

          unsubscribe = wallet.lightning.subscribeLnPay(
            payType.lightning,
            async event => {
              if (typeof event === "object") {
                if ("success" in event) {
                  unsubscribe()
                  resolve({ preimage: (event.success as any).preimage })
                } else if ("waiting_for_refund" in event) {
                  unsubscribe()
                  reject(new Error(event.waiting_for_refund.error_reason))
                } else if ("refunded" in event) {
                  unsubscribe()
                  reject(new Error(event.refunded.gateway_error))
                } else if ("unexpected_error" in event) {
                  unsubscribe()
                  reject(new Error(event.unexpected_error.error_message))
                }
              }
            },
          )
        },
      )
  }
}
