import * as formRepository from "../repositories/form.repository";

export const getProductSchema = async () => {
  const { parentOptions, dataMap } =
    await formRepository.getCategoriesForSchema();

  const schema = {
    type: "object",
    required: [
      "name",
      "parentCategoryId",
      "categoryId",
      "thumbnail",
      "images",
      "startPrice",
      "stepPrice",
      "description",
      "endTime",
      "autoExtend",
    ],
    properties: {
      name: {
        type: "string",
        title: "Product Name",
        maxLength: 500,
      },
      parentCategoryId: {
        type: "integer",
        title: "Parent Category",
        oneOf: parentOptions,
      },
      categoryId: {
        type: "integer",
        title: "Category",
      },
      thumbnail: {
        type: "string",
        title: "Thumbnail Image",
        format: "data-url",
      },
      images: {
        type: "array",
        title: "Additional Images",
        minItems: 2,
        items: {
          type: "string",
          format: "data-url",
        },
      },
      startPrice: {
        type: "number",
        title: "Starting Price",
        minimum: 0,
      },
      stepPrice: {
        type: "number",
        title: "Bid Step",
        minimum: 0,
      },
      buyNowPrice: {
        type: "number",
        title: "Buy Now Price",
        minimum: 0,
      },
      description: {
        type: "string",
        title: "Product Description",
      },
      endTime: {
        type: "string",
        title: "End Time",
        format: "date-time",
      },
      autoExtend: {
        type: "string",
        title: "Auto Extend",
        enum: ["yes", "no"],
        default: "no",
      },
    },
  };

  const uiSchema = {
    name: {
      "ui:placeholder": "Enter product name",
    },
    parentCategoryId: {
      "ui:widget": "select",
    },
    categoryId: {
      "ui:widget": "select",
      "ui:options": {
        dataMap,
      },
    },
    thumbnail: {
      "ui:options": {
        accept: "image/*",
      },
    },
    images: {
      "ui:options": {
        accept: "image/*",
      },
    },
    startPrice: {
      "ui:placeholder": "Enter starting price",
    },
    stepPrice: {
      "ui:placeholder": "Enter bid step",
    },
    buyNowPrice: {
      "ui:placeholder": "Enter buy now price (optional)",
    },
    description: {
      "ui:widget": "textarea",
      "ui:options": {
        rows: 10,
      },
    },
    endTime: {
      "ui:widget": "alt-datetime",
    },
    autoExtend: {
      "ui:widget": "radio",
    },
  };

  return {
    schema,
    uiSchema,
    dataMap,
  };
};
