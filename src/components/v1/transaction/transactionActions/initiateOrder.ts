import { Response } from "express";
import { z } from "zod";
import { ClientSession, startSession } from "mongoose";
import Currency from "currency.js";

import {
  abortSessionWithResponse,
  commitSessionWithResponse,
  handleResponse,
} from "../../../../utils/response";
import { IRequest } from "../../../../utils/types";
import { IPaymentRecord, PaymentRecordModel } from "../transaction.model";
import { validatePayment } from "../../../../services/paymentProcessor/payment.utils";
import { initiateOrderSchema } from "../initiateOrder.policy";
import ProductModel from "../../products/products.model";
import UserModel from "../../user/user.model";
import { initiatePayment } from "../../../../services/paymentProcessor";
import platformConstants from "../../../../configs/platfromContants";
import { ulid } from "ulidx";
import { paymentLinkReturnType } from "../../../../services/paymentProcessor/payment.types";

async function initiateOrder(req: IRequest, res: Response) {
  const {
    idempotencyKey,
    productId,
    driver,
    deliveryLocation,
    currency,
    quantity,
  }: z.infer<typeof initiateOrderSchema> = req.body;
  const { user } = req;

  const session: ClientSession = await startSession();
  session.startTransaction();
  try {
    let paymentRecord = await PaymentRecordModel.findOne({
      idempotencyKey,
      User: user._id,
    }).session(session);

    if (paymentRecord) {
      const product = await ProductModel.findById({
        _id: productId,
      }).session(session);
      if (!product) {
        return abortSessionWithResponse({
          session,
          res,
          message: "product does not exist",
          status: 400,
        });
      }

      const { message, data, shouldCommit } = await validatePayment({
        session,
        paymentRecord,
        deliveryLocation,
        user: user,
        product,
      });

      if (shouldCommit) {
        return await commitSessionWithResponse({
          session,
          res,
          message,
          data,
        });
      } else {
        return abortSessionWithResponse({
          session,
          res,
          message,
          data,
        });
      }
    } else {
      const product = await ProductModel.findById({ _id: productId }).session(
        session
      );
      if (!product) {
        return abortSessionWithResponse({
          session,
          res,
          message: "product does not exist",
          status: 400,
        });
      }
      if (product.quantityInStock < 1) {
        abortSessionWithResponse({
          res,
          session,
          message: "out of stock",
          status: 400,
        });
      }
      if (quantity > product.quantityInStock) {
        return abortSessionWithResponse({
          res,
          session,
          message: "quantity is more than available quantity",
          status: 400,
        });
      }

      const supplier = await UserModel.findOne({
        _id: product.supplierId,
      }).session(session);
      if (!supplier) {
        return abortSessionWithResponse({
          session,
          res,
          message: "supplier does not exist",
          status: 400,
        });
      }
      console.log(
        "amount  ",
        Currency(product.price).multiply(quantity).value,
        product.price
      );

      let amount: number = Currency(product.price).multiply(quantity).value;
      let paymentData = {
        driver: driver as (typeof platformConstants.paymentDriver)[number],
        amount,
        currency:
          currency as (typeof platformConstants.paymentCurrency)[number],
        idempotencyKey,
        user,
        paymentReference: ulid(),
      };

      //TODO: calculate delivery fee and add to amount
      const paymentResult: paymentLinkReturnType = await initiatePayment(
        paymentData
      ).catch(async (err) => err);

      const { paymentLink, paymentId, driverReference, errorMessage } =
        await paymentResult;

      if (errorMessage) {
        return abortSessionWithResponse({
          session,
          res,
          message: errorMessage,
          status: 400,
        });
      }

      if (paymentLink || paymentId) {
        paymentRecord = await new PaymentRecordModel({
          idempotencyKey,
          User: user._id,
          Supplier: product.supplierId,
          Product: product._id,
          driver,
          currency,
          unitPrice: product.price,
          quantity,
          totalPrice: amount,
          driverReference,
          happenedAt: new Date(),
          paymentLink: paymentLink ?? paymentId,
        }).save({ session });
      }
      return commitSessionWithResponse({
        session,
        res,
        message: "Make your payment",
        data: {
          status: paymentRecord.status,
          paymentLink: paymentLink ?? null,
          paymentId: paymentId ?? null,
        },
      });
    }
  } catch (err) {
    abortSessionWithResponse({
      res,
      session,
      err,
      message: "Internal Server Error",
      status: 500,
    });
  }
}

export default initiateOrder;
