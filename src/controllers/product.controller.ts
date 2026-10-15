import {createProduct} from "../services/product.service.js";
import type{Request, Response} from "express";
import { createProductSchema } from "../schemas/product.schema.js";

export const create = async (
    req: Request,
    res: Response
) => {
    try{
      const data = createProductSchema.parse(req.body);

      const product = await createProduct(data);

        res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create product",
    });
  }
};
    