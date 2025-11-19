import * as categoryRepository from "./category.repository";

export const getCategoriesForSchema = async () => {
  const categoriesData = await categoryRepository.getAllCategories();

  const parentOptions: { const: number; title: string }[] = [];
  const dataMap: Record<string, { const: number; title: string }[]> = {};

  for (const parent of categoriesData.data) {
    parentOptions.push({
      const: parent.categoryId,
      title: parent.name,
    });

    dataMap[parent.categoryId.toString()] = parent.subCategories.map((sub) => ({
      const: sub.categoryId,
      title: sub.name,
    }));
  }

  return { parentOptions, dataMap };
};
