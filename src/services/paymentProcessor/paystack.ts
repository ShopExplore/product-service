import axios from "axios";
import Currency from "currency.js";
import { ulid } from "ulidx";

import appConfig from "../../configs";
import {
  paymentLinkReturnType,
  verifyPaymentReturnType,
} from "./payment.types";
import { PaymentRecordModel } from "../../components/v1/transaction/transaction.model";

const { paystackSecretKey } = appConfig;
const authHeader = {
  headers: {
    Authorization: `Bearer ${paystackSecretKey}`,
  },
};

export const createPaymentLink = async (
  amount: number,
  currency: string,
  email: string,
  reference: string
): paymentLinkReturnType => {
  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        amount,
        email,
        currency,
        reference,
      },
      authHeader
    );
    const { data, status } = response.data;

    if (status) {
      //create new paymentRecordModel
      // await new PaymentRecordModel({
      //   idempotencyKey: ulid(),
      // }).save();
      return {
        paymentLink: data.authorization_url,
        paymentId: data.reference,
        driverReference: data.reference,
      };
    } else {
      return { errorMessage: data.message };
    }
  } catch (err) {
    throw { errorMessage: err.message };
  }
};

export const verifyPayment = async (
  reference: string
): verifyPaymentReturnType => {
  try {
    const { data } = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      authHeader
    );

    const { status, message, data: responseData } = data;

    if (!status || responseData.status !== "success") {
      return {
        success: false,
        errorMessage: responseData.gateway_response || message,
      };
    }

    return {
      success: true,
      grossAmount: Currency(responseData.amount).value,
      txFee: Currency(responseData.fees).value,
      netAmount: Currency(responseData.amount).value,
      receiptUrl: responseData.receipt_url,
      chargeCurrency: responseData.currency,
    };
  } catch (err) {
    throw { success: false, errorMessage: err.message };
  }
};
