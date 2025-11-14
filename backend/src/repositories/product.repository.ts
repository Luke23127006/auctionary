import prisma from "../database/prisma"
import { toSlug } from "../utils/slug.util";
import { NotFoundError } from "../errors";

export interface PaginatedResult<T> {
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export const fullTextSearch = async (q: string, page: number = 1, limit: number = 10): Promise<PaginatedResult<any>> => {
    const offset = (page - 1) * limit;

    const [products, totalCount] = await Promise.all([
        prisma.$queryRaw<any[]>`
            SELECT 
                product_id,
                thumbnail_url,
                name,
                current_price,
                highest_bidder_id,
                status,
                start_time,
                end_time,
                bid_count,
                ts_rank(fts, websearch_to_tsquery('english', ${q})) as relevance
            FROM products
            WHERE 
                fts @@ websearch_to_tsquery('english', ${q})
                AND status = 'active'
                AND end_time > NOW()
            ORDER BY relevance DESC
            LIMIT ${limit} 
            OFFSET ${offset}
        `,
        // Count total
        prisma.$queryRaw<[{ count: bigint }]>`
            SELECT COUNT(*) as count
            FROM products
            WHERE 
                fts @@ websearch_to_tsquery('english', ${q})
                AND status = 'active'
                AND end_time > NOW()
        `
    ]);

    const total = Number(totalCount[0].count);

    return {
        data: products,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        }
    };
};

export const findByCategory = async (category: string, page: number, limit: number): Promise<PaginatedResult<any>> => {
    const slug = toSlug(category);
    const offset = (page - 1) * limit;

    const categoryExists = await prisma.categories.findFirst({
        where: { slug },
        select: { category_id: true }
    });

    if (!categoryExists) {
        throw new NotFoundError(`Category '${category}' not found`);
    }

    const [products, total] = await Promise.all([
        prisma.products.findMany({
            where: {
                categories: { slug },
                status: 'active',
                end_time: { gt: new Date() },
            },
            select: {
                product_id: true,
                thumbnail_url: true,
                name: true,
                current_price: true,
                highest_bidder_id: true,
                status: true,
                start_time: true,
                end_time: true,
                bid_count: true,
                categories: {
                    select: {
                        category_id: true,
                        name: true,
                        slug: true,
                    }
                },
            },
            orderBy: { created_at: 'desc' },
            take: limit,
            skip: offset,
        }),
        prisma.products.count({
            where: {
                categories: { slug },
                status: 'active',
                end_time: { gt: new Date() },
            }
        })
    ]);

    return {
        data: products,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        }
    };
};