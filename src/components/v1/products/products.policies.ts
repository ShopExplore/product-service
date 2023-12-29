import { z } from "zod";
import platformConstants from "../../../configs/platfromContants";
import { isValidId } from "../../../utils/helpers";

const { productCategories } = platformConstants;

export const createProductSchema = z.object({
  productName: z.string(),
  category: z
    .string()
    .refine((data: (typeof productCategories)[number]) =>
      productCategories.includes(data)
    ),
  pics: z.array(z.string()).optional(),
  description: z.string(),
  price: z.number(),
  quantityInStock: z.number(),
  lowStockAt: z.number(),
});

export const productIdSchema = z.object({
  productId: z.string().refine((id) => isValidId(id)),
});

export const editProductSchema = z.object({
  productId: z.string().refine((id) => isValidId(id)),
  productName: z.string(),
  category: z
    .string()
    .refine((data: (typeof productCategories)[number]) =>
      productCategories.includes(data)
    ),
  description: z.string(),
  price: z.number(),
  quantityInStock: z.number(),
  lowStockAt: z.number(),
});

export const searchProductSchema = z.object({
  id: z.string().refine((id) => isValidId(id)),
  search: z.string(),
});
