import prisma from '../database/prisma';
import { toNum } from '../utils/number.util';

export interface HighestBidder {
    current_price: number;
    highest_bidder: {
        id: number;
        full_name: string;
        positive_reviews: number;
        negative_reviews: number;
    }
}

export const findHighestBidById = async (productId: number): Promise<HighestBidder | null> => {
    const currentBid = await prisma.products.findUnique({
        where: { 
            product_id: productId 
        },
        select: {
            current_price: true,
            users_products_highest_bidder_idTousers: {
                select: {
                    id: true,
                    full_name: true,
                    positive_reviews: true,
                    negative_reviews: true
                }
            }
        }
    });

    if (!currentBid) {
        return null;
    }

    return {
        current_price: toNum(currentBid.current_price),
        highest_bidder: {
            id: currentBid.users_products_highest_bidder_idTousers?.id ?? 0,
            full_name: currentBid.users_products_highest_bidder_idTousers?.full_name ?? '',
            positive_reviews: currentBid.users_products_highest_bidder_idTousers?.positive_reviews ?? 0,
            negative_reviews: currentBid.users_products_highest_bidder_idTousers?.negative_reviews ?? 0,
        }
    }
}

export const getMaxPriceByBidderId = async (productId: number, bidderId: number): Promise<number> => {
    const autoBid = await prisma.auto_bids.findUnique({
        where: {
            product_id_bidder_id: {
                product_id: productId,
                bidder_id: bidderId
            }
        },
        select: { max_amount: true }
    });
    return toNum(autoBid?.max_amount);
};

export const updateMaxPrice = async (productId: number, bidderId: number, newMaxPrice: number): Promise<void> => {
    await prisma.auto_bids.update({
        where: {
            product_id_bidder_id: {
                product_id: productId,
                bidder_id: bidderId
            }
        },
        data: {
            max_amount: newMaxPrice
        }
    });
};

export const getCurrentPriceById = async (productId: number): Promise<number> => {
    const product = await prisma.products.findUnique({
        where: { product_id: productId },
        select: { current_price: true }
    });
    return toNum(product?.current_price);
};

export const createAutoBid = async (productId: number, bidderId: number, maxPrice: number): Promise<void> => {
    await prisma.auto_bids.create({
        data: {
            product_id: productId,
            bidder_id: bidderId,
            max_amount: maxPrice
        }
    });
};

export const updateCurrentPrice = async (productId: number, bidderId: number, newPrice: number): Promise<void> => {
    await prisma.$transaction([
        prisma.products.update({
            where: { product_id: productId },
            data: { 
                current_price: newPrice,
                bid_count: { increment: 1 }
            }
        }),
        prisma.bids.create({
            data: {
                product_id: productId,
                bidder_id: bidderId,
                amount: newPrice
            }
        })
    ]);
};

export const createOrUpdateAutoBid = async (productId: number, bidderId: number, maxPrice: number): Promise<void> => {
    await prisma.auto_bids.upsert({
        where: {
            product_id_bidder_id: {
                product_id: productId,
                bidder_id: bidderId
            }
        },
        update: {
            max_amount: maxPrice
        },
        create: {
            product_id: productId,
            bidder_id: bidderId,
            max_amount: maxPrice
        }
    });
};