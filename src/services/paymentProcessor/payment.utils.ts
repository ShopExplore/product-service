import { ClientSession } from "mongoose";

import {
  IPaymentRecord,
  deliveryLocationType,
} from "../../components/v1/transaction/transaction.types";
import { IUser } from "../../components/v1/user/user.types";
import { verifyPayment } from ".";
import { completeTransaction } from "../../components/v1/transaction/transaction.utils";
import ProductModel, {
  IProduct,
} from "../../components/v1/products/products.model";

export const validatePayment = async ({
  session,
  paymentRecord,
  deliveryLocation,
  user,
  product,
}: {
  session: ClientSession;
  paymentRecord: IPaymentRecord;
  deliveryLocation: deliveryLocationType;
  user: IUser;
  product: IProduct;
}): Promise<{
  message: string;
  shouldCommit?: boolean;
  data?: {
    status: string;
    paymentLink?: string;
    paymentId?: string;
  };
}> => {
  console.log(paymentRecord.status);

  if (paymentRecord.status === "successful") {
    if (!paymentRecord.isOrderProcessed)
      await completeTransaction(
        session,
        user,
        paymentRecord,
        deliveryLocation,
        product
      );
    return {
      message: "Payment already made",
    };
  }

  const paymentStatus = await verifyPayment(
    paymentRecord.driver,
    paymentRecord.driverReference
  );

  if (paymentStatus.success) {
    (paymentRecord.status = "successful"),
      (paymentRecord.happenedAt = new Date());

    await paymentRecord.save({ session });

    await completeTransaction(
      session,
      user,
      paymentRecord,
      deliveryLocation,
      product
    );

    return {
      message: "Payment successful",
      shouldCommit: true,
      data: {
        status: paymentRecord.status,
      },
    };
  } else {
    // TODO: is this a good place to implement expired payment link?

    return {
      message: "Make your payment",
      data: {
        status: paymentRecord.status,
        paymentLink: paymentRecord.paymentLink ?? null,
        paymentId: paymentRecord.driverReference ?? null,
      },
    };
  }
};
