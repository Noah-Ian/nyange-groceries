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

interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}
export const searchProducts = async (filters: ProductFilters) => {
  const { search, category, minPrice, maxPrice } = filters;

  return prisma.product.findMany({
    where: {
      AND: [
        search
          ? {
              name: {
                contains: search,
                mode: "insensitive",
              },
            }
          : {},
        category
          ? {
              category: {
                equals: category,
                mode: "insensitive",
              },
            }
          : {},
        minPrice !== undefined || maxPrice !== undefined
          ? {
              price: {
                ...(minPrice !== undefined && { gte: minPrice }),
                ...(maxPrice !== undefined && { lte: maxPrice }),
              },
            }
          : {},
      ],
    },
    orderBy: {
      name: "asc",
    },
  });
};