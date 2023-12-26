export type paymentLinkReturnType = Promise<{
  paymentLink?: string;
  paymentId?: string;
  driverReference?: string;
  errorMessage?: string;
}>;

export type verifyPaymentReturnType = Promise<{
  success?: boolean;
  errorMessage?: string;
  grossAmount?: number;
  txFee?: number;
  netAmount?: number;
  receiptUrl?: number;
  chargeCurrency?: number;
}>;
