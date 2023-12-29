import { Response } from "express";
import { z } from "zod";

import { IRequest } from "../../../../utils/types";
import { handleResponse } from "../../../../utils/response";
import { productIdSchema } from "../products.policies";

async function manageCart(req: IRequest, res: Response) {
  const { productId }: z.infer<typeof productIdSchema> = req.query;
  const { user } = req;
  try {
    //get user cart
    //find product by Id
    //if product exist add to cart
    return handleResponse({
      res,
      message: "success",
    });
  } catch (err) {
    handleResponse({
      res,
      err,
      message: "Internal Server Error",
      status: 500,
    });
  }
}

export default manageCart;
