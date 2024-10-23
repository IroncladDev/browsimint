import {
  Duration,
  GatewayInfo,
  JSONObject,
} from "@fedimint/core-web";
import { LocalStore } from "../../lib/storage";
import { InternalCall } from "../../types";
import { wallet } from "../state";

export type InternalParams =
  | {
      method: "payInvoice";
      params: {
        invoice: string;
        gatewayInfo?: GatewayInfo;
        extraMeta?: JSONObject;
      };
    }
  | {
      method: "createInvoice";
      params: {
        amount: number;
        description: string;
        expiryTime?: number;
        extraMeta?: JSONObject;
        gatewayInfo?: GatewayInfo;
      };
    }
  | {
      method: "spendEcash";
      params: {
        minAmount: number;
        tryCancelAfter?: number | Duration;
        includeInvite?: boolean;
        extraMeta?: JSONObject;
      };
    }
  | {
      method: "redeemEcash";
      params: {
        notes: string;
      };
    };

export default async function handleInternalMessage({
  method,
  params,
}: InternalCall) {
  const activeFederation = await LocalStore.getActiveFederation();

  if (activeFederation && !wallet.isOpen()) {
    await wallet.open(activeFederation.id);
  }

  switch (method) {
    case "payInvoice":
      return await wallet.lightning.payInvoice(
        params.invoice,
        params.gatewayInfo,
        params.extraMeta
      );
    case "createInvoice":
      return await wallet.lightning.createInvoice(
        params.amount,
        params.description,
        params.expiryTime,
        params.extraMeta,
        params.gatewayInfo
      );
    case "spendEcash":
      return await wallet.mint.spendNotes(
        params.minAmount,
        params.tryCancelAfter,
        params.includeInvite,
        params.extraMeta
      );
    case "redeemEcash":
      await wallet.mint.redeemEcash(params.notes);

      return await wallet.mint.parseNotes(params.notes);
  }
}
