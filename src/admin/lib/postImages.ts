import type { PostPayload } from "../../api/posts.api";
import { uploadImage } from "../../api/upload.api";

/** True for base64/`data:` image URLs (the CMS's local, not-yet-uploaded state). */
const isDataUrl = (src: string): boolean => src.startsWith("data:");

/** Converts a `data:` URL to a Blob so it can be sent as multipart. */
const dataUrlToBlob = (dataUrl: string): Promise<Blob> =>
  fetch(dataUrl).then((res) => res.blob());

/** Uploads a `data:` URL and returns its hosted Cloudinary URL (memoized per call). */
const makeUploader = () => {
  const cache = new Map<string, Promise<string>>();
  return (dataUrl: string): Promise<string> => {
    let pending = cache.get(dataUrl);
    if (!pending) {
      pending = dataUrlToBlob(dataUrl)
        .then(uploadImage)
        .then((r) => r.url);
      cache.set(dataUrl, pending);
    }
    return pending;
  };
};

/**
 * Resolves a post payload's images just before saving: any base64 cover or
 * inline editor image is uploaded to Cloudinary and swapped for its URL, so the
 * post request carries only URLs (no megabytes of base64). Already-hosted
 * `http` URLs — e.g. when editing an existing post — are left untouched, which
 * is what lets the backend delete only the images that were actually removed.
 */
export const resolvePostImages = async (
  payload: PostPayload,
): Promise<PostPayload> => {
  const upload = makeUploader();

  const image = isDataUrl(payload.image)
    ? await upload(payload.image)
    : payload.image;

  const doc = new DOMParser().parseFromString(payload.content, "text/html");
  const pendingImgs = Array.from(
    doc.querySelectorAll<HTMLImageElement>("img"),
  ).filter((img) => isDataUrl(img.getAttribute("src") ?? ""));

  for (const img of pendingImgs) {
    const url = await upload(img.getAttribute("src") as string);
    img.setAttribute("src", url);
  }

  const content = pendingImgs.length ? doc.body.innerHTML : payload.content;

  return { ...payload, image, content };
};
