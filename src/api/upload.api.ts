import { api } from "../lib/api";

export interface UploadResult {
  url: string;
  publicId: string;
}

interface UploadEnvelope {
  data: UploadResult;
}

/** Uploads to the backend, which stores it in Cloudinary and returns the URL. */
export const uploadImage = async (file: Blob): Promise<UploadResult> => {
  const form = new FormData();
  form.append("image", file, "image");
  const { data } = await api.post<UploadEnvelope>("/upload", form);
  return data.data;
};
