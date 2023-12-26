import { Document, Schema, Types, model } from "mongoose";

export interface IPurchased extends Document {
  User: Types.ObjectId;
  Product: Types.ObjectId;
  Supplier: Types.ObjectId;
  paymentRecord: Types.ObjectId;
  totalPrice: number;
  purchasedDate: Date;
}

const purchaseSchema = new Schema<IPurchased>(
  {
    User: { type: Schema.Types.ObjectId, ref: "User" },
    Product: { type: Schema.Types.ObjectId, ref: "Product" },
    Supplier: { type: Schema.Types.ObjectId, ref: "User" },
    paymentRecord: { type: Schema.Types.ObjectId, ref: "PaymentRecord" },
    totalPrice: Number,
    purchasedDate: Date,
  },
  { timestamps: true }
);

export const PurchaseModel = model<IPurchased>("Purchase", purchaseSchema);
