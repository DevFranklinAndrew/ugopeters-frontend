import { api } from "../lib/api";

export interface UploadResult {
  url: string;
  publicId: string;
}

interface UploadEnvelope {
  data: UploadResult;
}

/**
 * Uploads a single image to the backend (which stores it in Cloudinary and
 * returns the hosted URL). Sent as multipart/form-data under the `image` field;
 * the shared `api` instance already carries the admin auth cookie.
 */
export const uploadImage = async (file: Blob): Promise<UploadResult> => {
  const form = new FormData();
  form.append("image", file, "image");
  const { data } = await api.post<UploadEnvelope>("/upload", form);
  return data.data;
};
