import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";

export const validateMultipart =
  (schema: ZodObject<any>) =>
  async (request: Request, _response: Response, next: NextFunction) => {
    try {
      const rawBody = request.body;
      const files = (request.files as Express.Multer.File[]) || [];

      // 1. Transform dữ liệu (Thủ công hoặc dùng thư viện như 'zod-form-data')
      // Ở đây ta làm thủ công để bạn dễ hiểu logic:
      const payload = {
        ...rawBody,
        categoryId: Number(rawBody.categoryId),
        sellerId: Number(rawBody.sellerId),
        startPrice: Number(rawBody.startPrice),
        stepPrice: Number(rawBody.stepPrice),
        buyNowPrice: rawBody.buyNowPrice
          ? Number(rawBody.buyNowPrice)
          : undefined,
        endTime: new Date(rawBody.endTime),
        autoExtend: rawBody.autoExtend === "true",
        // Tạm thời giả lập mảng string để pass qua validate đoạn này,
        // vì URL thực tế chưa có (upload trong controller sau).
        // Hoặc bạn sửa schema Zod để chấp nhận File ở lớp ngoài cùng, nhưng cách dưới đơn giản hơn.
        images:
          files.length > 0 ? Array(files.length).fill("placeholder_url") : [],
      };

      // 2. Validate
      await schema.parseAsync(payload);

      // 3. Quan trọng: Gán data đã chuẩn hóa ngược lại vào req.body
      // Để Controller chỉ việc dùng, không cần parse lại
      request.body = payload;

      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        return _response.status(400).json({
          message: "Validation failed",
          errors: error,
        });
      }
      return next(error);
    }
  };
