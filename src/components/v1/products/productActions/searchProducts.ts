import { Response } from "express";
import { handleResponse } from "../../../../utils/response";
import { IRequest } from "../../../../utils/types";
import { z } from "zod";
import ProductModel from "../products.model";
import handlePaginate from "../../../../utils/paginate";
import { searchProductSchema } from "../products.policies";

async function searchProduct(req: IRequest, res: Response) {
  const { id, search }: z.infer<typeof searchProductSchema> = req.query;
  const { user: currentUser } = req;

  const { paginationOption, meta } = handlePaginate(req);
  try {
    if ((!currentUser && !req.query) || (currentUser && !req.query)) {
      const products = await ProductModel.find({}, null, paginationOption);

      return handleResponse({
        res,
        message: "products retrieved successfully",
        data: {
          products,
          meta,
        },
      });
    }

    if (id) {
      const product = await ProductModel.findById(id);
      if (!product) {
        return handleResponse({
          res,
          message: "product does not exist",
          status: 400,
        });
      }

      return handleResponse({
        res,
        message: "product retrieved successfully",
        data: product,
      });
    }

    const products = await ProductModel.find(
      {
        $text: { $search: search as string },
      },
      null,
      paginationOption
    );

    return handleResponse({
      res,
      message: "products retrieved successfully",
      data: {
        products,
        meta,
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

export default searchProduct;
