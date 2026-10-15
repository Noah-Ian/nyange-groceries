import prisma from "../lib/prisma.js"
import type {CreateProductInput} from "../schemas/product.schema.js"

export const createProduct = async (data:CreateProductInput
) => {
    return prisma.product.create({
        data:{
      name: data.name,
      description: data.description,
      price: data.price,
      stock: data.stock,
      imageUrl: data.imageUrl,
      category: data.category,
        },
    });
};

export const getAllProducts = async () => {
    return prisma.product.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
}