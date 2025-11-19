import { z } from "zod";

export const placeBidSchema = z.object({
    product_id: z.number().int().positive(),
    bidder_id: z.number().int().positive(),
    max_amount: z.number().positive(),
});

export type PlaceBidDto = z.infer<typeof placeBidSchema>;