import type { PostPayload } from "../../api/posts.api";
import { uploadImage } from "../../api/upload.api";

/** A `data:` URL is the CMS's local, not-yet-uploaded state. */
const isDataUrl = (src: string): boolean => src.startsWith("data:");

const dataUrlToBlob = (dataUrl: string): Promise<Blob> =>
  fetch(dataUrl).then((res) => res.blob());

/** Memoized, so the same image used twice uploads once. */
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
 * Uploads any base64 image in the payload and swaps it for its URL, so the save
 * request carries no megabytes of base64. Already-hosted URLs pass through
 * untouched — that's what lets the backend delete only what was really removed.
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
