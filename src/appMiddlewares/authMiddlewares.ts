import { NextFunction, Response } from "express";
import { IRequest, IToken } from "../utils/types";
import jwt from "jsonwebtoken";
import appConfig from "../configs";

export const validateTokenMiddleware = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  let token = req.headers.authorization as string;
  token = token?.replace("Bearer ", "");

  if (!token) return next();

  try {
    const decoded = jwt.verify(token, appConfig.authConfigs.jwtSecret);
    req.decoded = decoded as IToken;

    return next();
  } catch (err) {
    if (err.name) {
      if (err.name === "JsonWebTokenError") {
        res.status(401).send({ message: "invalid token", err });
      } else if (err.name === "TokenExpiredError") {
        res
          .status(401)
          .send({ message: "authentication expired. Please login again", err });
      }
    }
  }
};
