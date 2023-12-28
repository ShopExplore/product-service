import { NextFunction, Response } from "express";
import { IRequest } from "../utils/types";
import { handleResponse } from "../utils/response";
import { publishCustomerEvent } from "../utils/events/customerEvent";

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
    // const user = await UserModel.findById(ref);

    // if (!user) {
    //   return handleResponse({
    //     res,
    //     message: "authorization failed",
    //     status: 401,
    //   });
    // }

    // const userAuth = await UserAuth.findOne({
    //   User: user._id,
    // });

    // if (!userAuth) {
    //   return handleResponse({
    //     res,
    //     message: "authorization failed",
    //     status: 401,
    //   });
    // }

    const response = await publishCustomerEvent({ event: "GET_USER", data: ref });
    req.user = response.user
    req.userAuth = response.userAuth;
    req.role = role;
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
