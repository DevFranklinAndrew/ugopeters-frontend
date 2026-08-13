import axios from "axios";

/** `withCredentials` is required for the HTTP-only auth cookie to travel on
 *  cross-origin requests. The baseURL falls back to the local backend. */
export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL ?? "http://localhost:4000"}/api`,
  withCredentials: true,
});

export const getApiErrorMessage = (
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string => {
  if (axios.isAxiosError(error)) {
    return (
      (error.response?.data as { message?: string } | undefined)?.message ??
      error.message ??
      fallback
    );
  }
  return error instanceof Error ? error.message : fallback;
};
