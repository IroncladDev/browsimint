export type WeblnProviderMethods = {
  enable: [{}, void];
  makeInvoice: [
    MakeInvoiceParams,
    { paymentRequest: string }
  ];
  sendPayment: [string, { preimage: string }];
};

export type MakeInvoiceParams =
  | string
  | number
  | {
      amount?: string | number;
      defaultAmount?: string | number;
      minimumAmount?: string | number;
      maximumAmount?: string | number;
      defaultMemo?: string;
    };
