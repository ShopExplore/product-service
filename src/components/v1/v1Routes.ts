import { Router, Response } from "express";
import authRoutes from "./auth/auth.routes";
import { handleResponse } from "../../utils/response";
import userRouter from "./user/user.routes";
import productRouter from "./products/products.routes";
import orderRouter from "./transaction/initiateOrder.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/users", userRouter);
router.use("/products", productRouter);
router.use("/transaction", orderRouter);

router.get("/", (_req, res: Response) => {
  handleResponse({
    res,
    message: "welcome to the ConnText",
  });
});

const v1Routers = router;
export default v1Routers;
