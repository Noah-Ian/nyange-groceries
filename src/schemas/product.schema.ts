import {z} from "zod";

export const createProductSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),

  description: z.string().optional(),

  price: z.number().positive("Price must be greater than zero"),

  stock: z.number().int().min(0, "Stock cannot be negative"),

  imageUrl: z.url().optional(),

  category: z.string().optional(),
});

export type CreateProductInput = z.infer<
  typeof createProductSchema
>;


export const updateProductSchema = createProductSchema
  .partial()
  .refine(
    (data) => Object.keys(data).length > 0,
    "Provide at least one field to update"
  );

export type UpdateProductInput = z.infer<
  typeof updateProductSchema
>;
