import { supabase } from "../configs/supabase";

export const uploadFiles = async (
  bucket: string,
  files: Express.Multer.File[],
  folder: string = "uploads"
): Promise<string[]> => {
  if (files.length === 0) return [];

  const uploadPromises = files.map(async (file) => {
    // Logic đặt tên file đưa vào đây
    const fileName = `${folder}/${Date.now()}-${file.originalname.replace(
      /\s/g,
      "_"
    )}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      });

    if (error) throw new Error(`Upload failed: ${error.message}`);

    const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
    return data.publicUrl;
  });

  return await Promise.all(uploadPromises);
};
