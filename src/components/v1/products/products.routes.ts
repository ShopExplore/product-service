import { Router } from "express";
import { Channel } from "amqplib";

import policyMiddleware from "../../../appMiddlewares/policy.middlewares";
import requireAuth from "../../../appMiddlewares/requireAuth";
import { validateTokenMiddleware } from "../../../appMiddlewares/authMiddlewares";
import {
  createProductSchema,
  deleteProductSchema,
  editProductSchema,
  searchProductSchema,
} from "./products.policies";
import grantRoles from "../../../appMiddlewares/hasPermission";
import createProduct from "./productActions/createProduct";
import deleteProduct from "./productActions/deleteProduct";
import editProduct from "./productActions/editProduct";
import searchProduct from "./productActions/searchProducts";

const router = Router();

const productRouter = (channel: Channel, router: Router) => {

  router.post(
    "/",
    policyMiddleware(createProductSchema),
    validateTokenMiddleware,
    requireAuth(channel),
    grantRoles(["supplier"]),
    createProduct
  );

  router.delete(
    "/:productId",
    policyMiddleware(deleteProductSchema, "params"),
    validateTokenMiddleware,
    requireAuth(channel),
    grantRoles(["admin", "supplier"]),
    deleteProduct
  );

  router.patch(
    "/edit-product",
    policyMiddleware(editProductSchema),
    validateTokenMiddleware,
    requireAuth(channel),
    grantRoles(["supplier"]),
    editProduct
  );

  router.get(
    "/search-product",
    policyMiddleware(searchProductSchema, "query"),
    validateTokenMiddleware,
    requireAuth(channel),
    searchProduct
  );

  router.get(
    "/search-product",
    policyMiddleware(searchProductSchema, "query"),
    searchProduct
  );
}

// const productRouter = router;
export default productRouter;
