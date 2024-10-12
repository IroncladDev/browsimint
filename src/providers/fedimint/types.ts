// method: [args, return type]
export type FedimintProviderMethods = {
  generateEcash: [
    {
      amount?: string | number;
      defaultAmount?: string | number;
      minimumAmount?: string | number;
      maximumAmount?: string | number;
    },
    { notes: string }
  ];
  receiveEcash: [string, void];
  getAuthenticatedMember: [{}, { id: string; username: string }];
  getActiveFederation: [{}, { id: string; name: string; network: string }];
  getCurrencyCode: [{}, string];
  getLanguageCode: [{}, string];
};

