import { Response } from "express";
import { handleResponse } from "../../../../utils/response";
import { IRequest } from "../../../../utils/types";
import { z } from "zod";
import { createProductSchema } from "../products.policies";
import ProductModel from "../products.model";

async function createProductService(req: IRequest, res: Response) {
  const {
    productName,
    category,
    pics,
    description,
    price,
    quantityInStock,
    lowStockAt,
  }: z.infer<typeof createProductSchema> = req.body;
  const user = req.user;
  try {
    const product = await ProductModel.findOne({
      supplierId: user._id,
      productName,
      category,
    });

    if (product) {
      return handleResponse({
        res,
        message: "this product already exists",
        status: 400,
      });
    }

    const newProduct = await new ProductModel({
      supplierId: user._id,
      productName,
      category,
      pics,
      description,
      price,
      quantityInStock,
      lowStockAt,
    }).save();

    return handleResponse({
      res,
      message: "product created successfully",
      data: {
        product: newProduct,
      },
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

export default createProductService;
