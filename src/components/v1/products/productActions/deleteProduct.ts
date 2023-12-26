import { Response } from "express";
import { handleResponse } from "../../../../utils/response";
import { IRequest } from "../../../../utils/types";
import { z } from "zod";
import { deleteProductSchema } from "../products.policies";
import ProductModel from "../products.model";

async function deleteProduct(req: IRequest, res: Response) {
  const { productId }: z.infer<typeof deleteProductSchema> = req.params;
  try {
    const productExist = await ProductModel.findById(productId);
    if (!productExist) {
      return handleResponse({
        res,
        message: "this product does not exist",
      });
    }

    await productExist.deleteOne();

    return handleResponse({
      res,
      message: "product deleted successfully",
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

export default deleteProduct;
