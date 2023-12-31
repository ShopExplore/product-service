import { NextFunction, Response } from "express";
import { Channel } from "amqplib";
import { channel } from "..";

import { IRequest } from "../utils/types";
import { handleResponse } from "../utils/response";
// import { publishCustomerEvent } from "../utils/event";
import { publishMessage } from "../utils/event";
import appConfig from "../configs";

const { CUSTOMER_BINDING_KEY } = appConfig;

const requireAuthMiddleware = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  if (!req.decoded) {
    return handleResponse({
      res,
      message: "authentication is required",
      status: 401,
    });
  }

  const { ref, role } = req.decoded;

  try {
    // const response = await publishCustomerEvent({ event: "GET_USER", data: ref });

    const response = publishMessage(
      (await channel()) as Channel,
      CUSTOMER_BINDING_KEY,
      ref.toString()
    );
    console.log("response from message broker ", response);

    // req.user = response.user;
    // req.userAuth = response.userAuth;
    // req.role = role;
    return next();
  } catch (err) {
    return handleResponse({
      res,
      message: "Authentication error",
      status: 401,
      err,
    });
  }
};
export default requireAuthMiddleware;
