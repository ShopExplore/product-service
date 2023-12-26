import Currency from "currency.js";

import { IUser } from "../../components/v1/user/user.types";
import platformConstants from "../../configs/platfromContants";
import * as payStack from "./paystack";
import { paymentLinkReturnType } from "./payment.types";

export const initiatePayment = async ({
  driver,
  amount,
  currency,
  user,
  paymentReference,
}: {
  driver: (typeof platformConstants.paymentDriver)[number];
  amount: number;
  currency: (typeof platformConstants.paymentCurrency)[number];
  user: IUser;
  paymentReference: string;
}): paymentLinkReturnType => {
  amount = Currency(amount).value;
  switch (driver) {
    case "paystack":
      return await payStack.createPaymentLink(
        amount,
        currency,
        user.email,
        paymentReference
      );

    default:
      return {
        errorMessage:
          "Payment driver is either not yet supported in this marketplace or invalid",
      };
  }
};

export const verifyPayment = (
  driver: (typeof platformConstants.paymentDriver)[number],
  reference: string
) => {
  switch (driver) {
    case "paystack":
      return payStack.verifyPayment(reference);

    default:
      break;
  }
};
