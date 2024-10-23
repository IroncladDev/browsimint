import { postMessage } from "../postMessage";

export default class WeblnProvider {
  private hasBeenEnabled = false;

  async enable() {
    if (this.hasBeenEnabled) {
      return;
    }

    this.hasBeenEnabled = true;
  }

  async isEnabled() {
    return this.hasBeenEnabled;
  }

  async getInfo() {
    return {
      methods: [
        "enable",
        "isEnabled",
        "makeInvoice",
        "sendPayment",
        "getBalance",
      ],
    };
  }

  async getBalance(): Promise<{ balance: number; currency: "sats" }> {
    return await postMessage("getBalance", {}, "webln");
  }

  async makeInvoice(params: MakeInvoiceParams): Promise<{ paymentRequest: string }> {
    this.ensureEnabled();

    return await postMessage("makeInvoice", params, "webln");
  }

  async sendPayment(paymentRequest: string): Promise<{ preimage: string }> {
    this.ensureEnabled();

    return await postMessage("sendPayment", paymentRequest, "webln");
  }

  private ensureEnabled() {
    if (!this.hasBeenEnabled) {
      throw new Error("webln is not enabled");
    }
  }
}

export type MakeInvoiceParams = {
  amount?: string | number;
  defaultAmount?: string | number;
  minimumAmount?: string | number;
  maximumAmount?: string | number;
  defaultMemo?: string;
};
