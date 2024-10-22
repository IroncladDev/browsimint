export type WeblnProviderMethods = {
  makeInvoice: [MakeInvoiceParams, { paymentRequest: string }];
  sendPayment: [string, { preimage: string }];
  getBalance: [{}, {
    balance: number;
    currency: "sats"
  }];
};

export type MakeInvoiceParams = {
  amount?: string | number;
  defaultAmount?: string | number;
  minimumAmount?: string | number;
  maximumAmount?: string | number;
  defaultMemo?: string;
};
