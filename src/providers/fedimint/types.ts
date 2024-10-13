// method: [args, return type]
export type FedimintProviderMethods = {
  generateEcash: [
    {
      minAmount: number;
      tryCancelAfter: number;
      includeInvite: boolean;
    },
    { notes: string }
  ];
  receiveEcash: [string, void];
  getAuthenticatedMember: [{}, { id: string; username: string }];
  getActiveFederation: [{}, { id: string; name: string; network: string }];
  getCurrencyCode: [{}, string];
  getLanguageCode: [{}, string];
};
