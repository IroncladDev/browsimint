import {
  MakeInvoiceParams,
  WeblnProviderMethods,
} from "../../providers/webln/types";
import { fedimint } from "../background";

export default async function handleWeblnMessage<
  T extends keyof WeblnProviderMethods
>(
  method: T,
  params: WeblnProviderMethods[T][0]
): Promise<WeblnProviderMethods[T][1]> {
  switch (method) {
    case "makeInvoice":
      const input: MakeInvoiceParams = params as any;

      const amount =
        typeof input === "number"
          ? input
          : typeof input === "string"
          ? parseInt(input)
          : input.amount;

      return {
        paymentRequest: (
          await fedimint.lightning.createInvoice(
            Number(amount),
            typeof input === "object" ? input.defaultMemo ?? "" : ""
          )
        ).invoice,
      };
    case "sendPayment":
      return {
        preimage: (await fedimint.lightning.payInvoice(params as string))
          .contract_id,
      };
    case "enable":
    default:
      return;
  }
}
