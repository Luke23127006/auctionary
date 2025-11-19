import * as productRepository from "../repositories/product.repository";
import { SortOption } from "../api/schemas/product.schema";

export const searchProducts = async (
  q: string | undefined,
  category: string | undefined,
  page: number,
  limit: number,
  sort?: SortOption,
  exclude?: number
) => {
  if (category) {
    return await productRepository.findByCategory(
      category,
      page,
      limit,
      sort,
      exclude
    );
  }

  return await productRepository.fullTextSearch(q, page, limit, sort, exclude);
};

export const createProduct = async (data: {
  name: string;
  categoryId: number;
  sellerId: number;
  startPrice: number;
  stepPrice: number;
  buyNowPrice?: number;
  description: string;
  endTime: Date;
  autoExtend: string;
  thumbnail: string;
  images: string[];
}) => {
  const product = await productRepository.createProduct({
    name: data.name,
    category_id: data.categoryId,
    seller_id: data.sellerId,
    start_price: data.startPrice,
    step_price: data.stepPrice,
    buy_now_price: data.buyNowPrice,
    end_time: data.endTime,
    auto_extend: data.autoExtend === "yes",
    description: data.description,
    thumbnail: data.thumbnail,
    images: data.images,
  });

  return {
    productId: product.product_id,
    name: product.name,
    status: product.status,
  };
};

export const getProductDetailById = async (productId: number) => {
  const product = await productRepository.findDetailById(productId);
  return product;
};

export const getProductCommentsById = async (
  productId: number,
  page: number,
  limit: number
) => {
  return await productRepository.findCommentsById(productId, page, limit);
};

export const appendProductDescription = async (
  productId: number,
  sellerId: number,
  content: string
) => {
  await productRepository.appendProductDescription(
    productId,
    sellerId,
    content
  );
};
