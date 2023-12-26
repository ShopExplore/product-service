import { Response } from "express";
import { handleResponse } from "../../../../utils/response";
import { IRequest } from "../../../../utils/types";
import { z } from "zod";
import { editProductSchema } from "../products.policies";
import ProductModel from "../products.model";
import platformConstants from "../../../../configs/platfromContants";

async function editProduct(req: IRequest, res: Response) {
  const {
    productId,
    productName,
    category,
    description,
    price,
    quantityInStock,
    lowStockAt,
  }: z.infer<typeof editProductSchema> = req.body;

  const { user } = req;
  try {
    const product = await ProductModel.findById(productId);
    if (!product) {
      return handleResponse({
        res,
        message: "this product does not exist",
      });
    }

    const duplicateProducts = await ProductModel.find({
      supplierId: user._id,
      productName,
      category,
    });
    if (duplicateProducts.length > 1) {
      return handleResponse({
        res,
        message: "a product with this name already exist",
        status: 400,
      });
    }

    if (productName !== product.productName) product.productName = productName;
    if (category !== product.category)
      product.category =
        category as (typeof platformConstants.productCategories)[number];
    if (description !== product.description) product.description = description;
    if (price !== product.price) product.price = price;
    if (quantityInStock !== product.quantityInStock)
      product.quantityInStock = quantityInStock;
    if (lowStockAt !== product.lowStockAt) product.lowStockAt = lowStockAt;

    await product.save();
    return handleResponse({
      res,
      message: "product updated successfully",
      data: product,
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

export default editProduct;
