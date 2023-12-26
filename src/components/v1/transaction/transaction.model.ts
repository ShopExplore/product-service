import { Document, Schema, Types, model } from "mongoose";
import platformConstants from "../../../configs/platfromContants";
import { IPaymentRecord, ITransaction } from "./transaction.types";

const { paymentDriver, paymentCurrency, paymentStatus, orderStatus } =
  platformConstants;

//payment details
const paymentRecordSchema = new Schema<IPaymentRecord>(
  {
    idempotencyKey: String,
    User: { type: Schema.Types.ObjectId, ref: "User" },
    Supplier: { type: Schema.Types.ObjectId, ref: "User" },
    Product: { type: Schema.Types.ObjectId, ref: "Product" },
    driver: { type: String, enum: paymentDriver },
    method: String,
    currency: { type: String, enum: paymentCurrency },
    unitPrice: Number,
    quantity: Number,
    totalPrice: Number,
    status: { type: String, enum: paymentStatus, default: "pending" },
    driverReference: String,
    isOrderProcessed: { type: Boolean, default: false },
    happenedAt: Date,
    paymentLink: String,
    deliveryFee: Number,
  },
  { timestamps: true }
);

export const PaymentRecordModel = model<IPaymentRecord>(
  "PaymentRecord",
  paymentRecordSchema
);

//Transaction
const transactionSchema = new Schema<ITransaction>({
  User: { type: Schema.Types.ObjectId, ref: "User" },
  Supplier: { type: Schema.Types.ObjectId, ref: "User" },
  deliveryLocation: {
    country: String,
    postalCode: String,
    state: String,
    city: String,
  },
  Product: { type: Schema.Types.ObjectId, ref: "Product" },
  paymentRecord: { type: Schema.Types.ObjectId, ref: "PaymentRecord" },
  txFee: Number,
  orderStatus: { type: String, enum: orderStatus, default: "pending" },
});

export const TransactionModel = model<ITransaction>(
  "Transaction",
  transactionSchema
);
export { IPaymentRecord };
