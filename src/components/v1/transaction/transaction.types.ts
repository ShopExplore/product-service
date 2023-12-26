import { Document, Types } from "mongoose";
import platformConstants from "../../../configs/platfromContants";

const { paymentDriver, paymentCurrency, paymentStatus, orderStatus } =
  platformConstants;

export interface IPaymentRecord extends Document {
  idempotencyKey: string;
  User: Types.ObjectId;
  Supplier: Types.ObjectId;
  Product: Types.ObjectId;
  driver: (typeof paymentDriver)[number];
  method?: string;
  currency: (typeof paymentCurrency)[number];
  unitPrice: number;
  quantity: number;
  deliveryFee?: number;
  totalPrice: number;
  status?: (typeof paymentStatus)[number];
  driverReference: string;
  paymentLink: string;
  isOrderProcessed: boolean;
  happenedAt: Date;
}

export type deliveryLocationType = {
  country?: string;
  postalCode?: string;
  state?: string;
  city?: string;
};

export interface ITransaction extends Document {
  //order details
  User: Types.ObjectId;
  Supplier: Types.ObjectId;
  deliveryLocation: deliveryLocationType;
  Product: Types.ObjectId;
  paymentRecord?: Types.ObjectId;
  txFee: number;
  orderStatus: (typeof orderStatus)[number];
}
