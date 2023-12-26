import { Router } from "express";
import policyMiddleware from "../../../appMiddlewares/policy.middlewares";
import requireAuth from "../auth/authMiddlewares/requireAuth";
import { validateTokenMiddleware } from "../auth/authMiddlewares";
import grantRoles from "../../../appMiddlewares/hasPermission";
import initiateOrder from "./transactionActions/initiateOrder";
import { initiateOrderSchema } from "./initiateOrder.policy";

const router = Router();

router.post(
  "/initiate-order",
  policyMiddleware(initiateOrderSchema),
  validateTokenMiddleware,
  requireAuth,
  grantRoles(["user"]),
  initiateOrder
);

const orderRouter = router;
export default orderRouter;
