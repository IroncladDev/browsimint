import { FedimintWallet, GatewayInfo, JSONObject } from "@fedimint/core-web";

export type WeblnParams =
  | {
      method: "getBalance";
      params: undefined;
    }
  | {
      method: "makeInvoice";
      params: {
        amount: number;
        description: string;
        expiryTime?: number;
        extraMeta?: JSONObject;
        gatewayInfo?: GatewayInfo;
      };
    }
  | {
      method: "sendPayment";
      params: {
        paymentRequest: string;
        extraMeta?: JSONObject;
        gatewayInfo?: GatewayInfo;
      };
    };

export default async function handleWeblnMessage(
  { method, params }: WeblnParams,
  wallet: FedimintWallet
) {
  switch (method) {
    case "getBalance":
      return { balance: await wallet.balance.getBalance(), currency: "sats" };
    case "makeInvoice":
      return await wallet.lightning.createInvoice(
        params.amount,
        params.description,
        params.expiryTime,
        params.extraMeta,
        params.gatewayInfo
      );
    case "sendPayment":
      return {
        preimage: (
          await wallet.lightning.payInvoice(
            params.paymentRequest,
            params.gatewayInfo,
            params.extraMeta
          )
        ).contract_id,
      };
  }
}
