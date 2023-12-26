import { Document, Schema, Types, model } from "mongoose";
import platformConstants from "../../../configs/platfromContants";

const { productCategories } = platformConstants;

export interface IProduct extends Document {
  supplierId: Types.ObjectId;
  productName: string;
  category: (typeof productCategories)[number];
  pics: string[];
  description: string;
  price: number;
  quantityInStock: number;
  reviews?: Array<Types.ObjectId>;
  lowStockAt: number; //at this number or less, low stock alert is sent to the supplier
}

const productSchema = new Schema<IProduct>({
  supplierId: Schema.Types.ObjectId,
  productName: String,
  category: {
    type: String,
    enum: productCategories,
    required: true,
  },
  pics: [
    {
      type: String,
      required: true,
    },
  ],
  description: String,
  price: Number,
  quantityInStock: Number,
  reviews: [Schema.Types.ObjectId],
  lowStockAt: Number,
});

productSchema.index({
  productName: "text",
  category: "text",
  description: "text",
});

const ProductModel = model<IProduct>("Product", productSchema);
export default ProductModel;
