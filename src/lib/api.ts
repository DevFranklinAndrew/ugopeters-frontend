import axios from "axios";

/**
 * Shared axios instance for the API. `withCredentials` is required so the
 * HTTP-only auth cookie is sent/received on cross-origin requests (the backend
 * CORS is configured with `credentials: true`). Base URL falls back to the
 * local backend so dev works with zero config; Vercel supplies VITE_API_URL.
 */
export const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL ?? "http://localhost:4000"}/api`,
  withCredentials: true,
});

/** Extracts a human-readable message from an axios/API error for display. */
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
