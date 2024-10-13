import {
  WeblnProviderMethods,
} from "../../providers/webln/types";

export default async function handleWeblnMessage<
  T extends keyof WeblnProviderMethods
>(
  method: T,
  _params: WeblnProviderMethods[T][0]
): Promise<WeblnProviderMethods[T][1]> {
  switch (method) {
    case "makeInvoice":
      return {
        paymentRequest: "lnbc10n1pnsksgmpp5x45p08eugt7k73c3hy3680l740cwc5q9hmrnck6f4krxeevlevaqdq5g9kxy7fqd9h8vmmfvdjscqzzsxqyz5vqsp5gx67frzq8cxz6nxm4zyvttstwq67n2mm84msd0ahxk7cd6ndw88q9qxpqysgqahx4nhqey8c4n7hqa8alfcfhzj2xyzdxadelwfdkdfw2aq76czuhy5e2yqrzcu6f6rysv6cwppxaztl0528umuz27m6uu7xjhrsnh8qpdsk75g",
      };
    case "sendPayment":
      return {
        preimage: "42e1a1c8e6b0ba2ad8eef646106b61aa2e98c8db76464626347f705ac795253c",
      };
    case "enable":
    default:
      return;
  }
}
