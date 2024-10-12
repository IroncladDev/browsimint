import {
  WeblnProviderMethods,
} from "../../providers/webln/types";

export default async function handleWeblnMessage<
  T extends keyof WeblnProviderMethods
>(
  method: T,
  params: WeblnProviderMethods[T][0]
): Promise<WeblnProviderMethods[T][1]> {
  switch (method) {
    case "makeInvoice":
      return {
        // TODO: placeholder
        paymentRequest: "lnbc100",
      };
    case "sendPayment":
      return {
        // TODO: placeholder
        preimage: "asdf",
      };
    case "enable":
    default:
      return;
  }
}
