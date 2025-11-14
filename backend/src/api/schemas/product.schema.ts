import { z } from "zod";

export const productSearchQuerySchema = z.object({
    q: z.string().optional(),
    category: z.string().optional(),
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(100).optional().default(10),
}).refine((data) => data.q || data.category, {
    message: "At least one of 'q' or 'category' must be provided",
    path: ["q", "category"],
}).refine((data) => !(data.q && data.category), {
    message: "Cannot search by both 'q' and 'category' at the same time",
    path: ["q", "category"],
});

export type ProductSearchQuery = z.infer<typeof productSearchQuerySchema>;