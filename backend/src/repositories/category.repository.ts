// category.repository.ts
import prisma from "../database/prisma";
import { NotFoundError } from "../errors";

interface SubCategory {
  categoryId: number;
  name: string;
}

export interface Category {
  data: {
    categoryId: number;
    name: string;
    subCategories: SubCategory[];
  }[];
}

export const getCategoryBySlug = async (slug: string) => {
  const category = await prisma.categories.findFirst({
    where: { slug },
    select: { category_id: true, parent_id: true },
  });

  if (!category) {
    throw new NotFoundError(`Category '${slug}' not found`);
  }

  return {
    categoryId: category.category_id,
    parentId: category.parent_id,
  };
};

export const getChildCategories = async (parentId: number) => {
  const categories = await prisma.categories.findMany({
    where: { parent_id: parentId },
    select: { category_id: true },
  });
  return categories.map((c) => ({ categoryId: c.category_id }));
};

export const getCategoryIds = async (slug: string): Promise<number[]> => {
  const category = await prisma.categories.findFirst({
    where: { slug },
    select: { category_id: true, parent_id: true },
  });

  if (!category) return [];

  if (category.parent_id === null) {
    const children = await prisma.categories.findMany({
      where: { parent_id: category.category_id },
      select: { category_id: true },
    });

    return [category.category_id, ...children.map((c) => c.category_id)];
  }

  return [category.category_id];
};

export const getAllCategories = async (): Promise<Category> => {
  const parents = await prisma.$queryRaw<
    Array<{ category_id: number; name: string }>
  >`
        SELECT category_id, name
        FROM categories
        WHERE parent_id IS NULL
    `;

  const result: Category["data"] = [];

  for (const parent of parents) {
    const children = await prisma.$queryRaw<
      Array<{ category_id: number; name: string }>
    >`
            SELECT category_id, name
            FROM categories
            WHERE parent_id = ${parent.category_id}
        `;

    result.push({
      categoryId: parent.category_id,
      name: parent.name,
      subCategories: children.map((c) => ({
        categoryId: c.category_id,
        name: c.name,
      })),
    });
  }

  return { data: result };
};
