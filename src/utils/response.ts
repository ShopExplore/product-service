import { Response } from "express";
import { ulid } from "ulidx";

import appConfig from "../configs";
import {
  IRequest,
  handleResponseArgType,
  handleSessionResArgType,
} from "./types";

export const handleResponse = ({
  res,
  data,
  status = 200,
  err,
  message,
}: handleResponseArgType): Response => {
  if (err && appConfig.isDev) console.log(err);

  if (status >= 400) {
    if (err && err.name && err.name === "MongoError") {
      if (err.code === 11000)
        return res.status(400).json({
          message: "duplicate detected",
        });
    }
  }

  return res.status(status).json({
    message,
    data,
  });
};

export const commitSessionWithResponse = async ({
  res,
  data,
  status = 200,
  message,
  session,
  err = null,
}: handleSessionResArgType) => {
  await session.commitTransaction();
  session.endSession();

  return handleResponse({ res, data, status, message, err });
};

export const abortSessionWithResponse = async ({
  res,
  data,
  status = 200,
  err = null,
  message,
  session,
}: handleSessionResArgType) => {
  await session.abortTransaction();
  session.endSession();

  return handleResponse({ res, data, status, message, err });
};
