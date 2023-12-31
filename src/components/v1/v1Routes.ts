import { Router, Response } from "express";
import { Channel } from "amqplib";

import { handleResponse } from "../../utils/response";
import productRouter from "./products/products.routes";

const router = Router();

router.use("/products", productRouter);

router.get("/", (_req, res: Response) => {
  handleResponse({
    res,
    message: "welcome to shopExplore product service",
  });
});

const v1Routers = router;
export default v1Routers;
