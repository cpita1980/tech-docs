import { z } from "zod";

export const articleSchema = z.object({
    title: z.string().min(1, "Title is required").max(100, "Title is too long"),
    content: z.any(), // EditorJS output is a complex object, we'll validate it's an object/array at least
    categoryId: z.string().min(1, "Category is required"),
    published: z.boolean().optional(),
});

export const articleUpdateSchema = articleSchema.partial();
