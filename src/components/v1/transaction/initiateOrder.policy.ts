import { z } from "zod";
import platformConstants from "../../../configs/platfromContants";

export const initiateOrderSchema = z.object({
  idempotencyKey: z.string().optional(),
  productId: z.string(),
  driver: z.string(),
  deliveryLocation: z.object({
    country: z.string(),
    postalCode: z.string(),
    state: z.string(),
    city: z.string(),
  }),
  currency: z
    .string()
    .refine((value: (typeof platformConstants.paymentCurrency)[number]) =>
      platformConstants.paymentCurrency.includes(value)
    ),
  quantity: z.number().default(1),
});
