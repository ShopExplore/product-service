//reduce the quantity of product in the database
//calculate deliveryFee base on the deliveryLocation(not implementing here, do this wen making payment)
//update deliveryFee (not implementing here, do this wen making payment)
//add deliveryFee to totalPrice in paymentRecored then update the txFee for Transaction (not implementing here, do this wen making payment)
//orderFullfilment: send email notification to supplier
//after verify payment, create new Transaction model

import { ClientSession } from "mongoose";
import { IProduct } from "../products/products.model";
import { IUser } from "../user/user.types";
import { IPaymentRecord, TransactionModel } from "./transaction.model";
import { deliveryLocationType } from "./transaction.types";
import { abort } from "process";

export const completeTransaction = async (
  session: ClientSession,
  user: IUser,
  paymentRecord: IPaymentRecord,
  deliveryLocation: deliveryLocationType,
  product: IProduct
) => {
  const {
    Product: productId,
    Supplier,
    _id: paymentRecordId,
    totalPrice,
  } = paymentRecord;

  try {
    const transactionExist = await TransactionModel.findOne({
      paymentRecord: paymentRecordId,
    }).session(session);
    if (transactionExist) abort;

    product.quantityInStock -= paymentRecord.quantity;

    await product.save({ session });

    await new TransactionModel({
      User: user._id,
      Supplier,
      deliveryLocation,
      Product: productId,
      paymentRecord: paymentRecordId,
      txFee: totalPrice,
      orderStatus: "in-process",
    }).save({ session });
  } catch (err) {
    throw err;
  }

  //TODO: handle shipping and update orderStatus to "shipping"
  //TODO: send new order email to supplier
  //TODO: send order details email to customer
};
