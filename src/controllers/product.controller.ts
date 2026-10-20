import {createProduct, getAllProducts, searchProducts, getProductById, updateProduct, deleteProduct } from "../services/product.service.js";
import type{Request, Response} from "express";
import { createProductSchema, updateProductSchema } from "../schemas/product.schema.js";


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

export const getAll = async (
  req: Request,
  res: Response
) => {
  try {
    const products = await getAllProducts();

    res.status(200).json({
      message: "Products retrieved successfully",
      products,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to retrieve products",
    });
  }
};
    
export const search = async (
  req: Request,
  res: Response
) => {
  try{
    const{search, category, minPrice, maxPrice}= req.query;

    const products = await searchProducts({
      search: typeof search === "string" ? search : undefined,
      category: typeof category === "string" ? category : undefined,
      minPrice: typeof minPrice === "string"? Number(minPrice): undefined,
      maxPrice: typeof maxPrice ==="string"? Number(maxPrice): undefined
  });

  res.status(200).json({
    count: products.length,
    products,
  });
}catch(error){
  console.error(error);

  res.status(500).json({
    message:"Failed to search products"
  });
}
};


export const getById = async (
  req: Request,
  res: Response
) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({
      message: "Invalid product ID",
    });
    return;
  }

  try {
    const product = await getProductById(id);

    if (!product) {
      res.status(404).json({
        message: "Product not found",
      });
      return;
    }

    res.status(200).json({ product });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to retrieve product",
    });
  }
};


export const update = async (
  req: Request,
  res: Response
) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({
      message: "Invalid product ID",
    });
    return;
  }

  try {
    const data = updateProductSchema.parse(req.body);
    const product = await updateProduct(id, data);

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    if (error instanceof Error && "issues" in error) {
      res.status(400).json({
        message: "Validation failed",
        errors: error.issues,
      });
      return;
    }

    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      res.status(404).json({
        message: "Product not found",
      });
      return;
    }

    console.error(error);

    res.status(500).json({
      message: "Failed to update product",
    });
  }
};


export const remove = async (
  req: Request,
  res: Response
) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    res.status(400).json({
      message: "Invalid product ID",
    });
    return;
  }

  try {
    await deleteProduct(id);

    res.status(200).json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2025"
    ) {
      res.status(404).json({
        message: "Product not found",
      });
      return;
    }

    console.error(error);

    res.status(500).json({
      message: "Failed to delete product",
    });
  }
};
