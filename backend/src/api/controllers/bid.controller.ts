import { Request, Response, NextFunction } from 'express';
import * as bidService from '../../services/bid.service';
import { placeBidSchema } from '../schemas/bid.schema';

export const getHighestBidById = async (
    request: Request,
    response: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const productId = Number(request.params.id);
        if (!productId || isNaN(productId)) {
            response.status(400).json({
                success: false,
                error: 'Invalid product ID'
            });
            return;
        }
        const result = await bidService.getHighestBidById(productId);
        response.status(200).json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('[getHighestBidById] Error:', error);
        next(error);
    }
};

export const placeBid = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        const { product_id, bidder_id, max_amount } = placeBidSchema.parse(request.body);
        await bidService.placeBid(product_id, bidder_id, max_amount);
        
        response.status(200).json({
            success: true,
            message: 'Bid placed successfully'
        });
    }
    catch (error) {
        console.error('[placeBid] Error:', error);
        next(error);
    }
};