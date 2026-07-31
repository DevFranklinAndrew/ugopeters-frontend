import { api } from "../lib/api";

/**
 * A newsletter subscriber. Mirrors the backend `toPublicSubscriber` shape
 * (backend/src/controllers/subscriber.controller.ts). Single source of truth
 * for the subscriber type across the app (public form + admin page).
 */
export interface Subscriber {
  id: string;
  email: string;
  createdAt: string; // ISO string
}

/** Query params accepted by `GET /api/subscribers` (server-side paging + search). */
export interface SubscriberListParams {
  page?: number;
  limit?: number;
  search?: string;
}

/** Pagination metadata returned alongside a list of subscribers. */
export interface SubscriberPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface SubscriberListResult {
  subscribers: Subscriber[];
  pagination: SubscriberPagination;
}

/** Centralized React Query keys for the subscribers resource. */
export const subscribersKeys = {
  all: ["subscribers"] as const,
  list: (params: SubscriberListParams) =>
    ["subscribers", "list", params] as const,
  admin: () => ["subscribers", "admin"] as const,
};

interface SubscribeEnvelope {
  message: string;
  data: { subscriber: Subscriber };
}
interface SubscriberListEnvelope {
  data: SubscriberListResult;
}

/** Serializes list params to a query string, dropping undefined values. */
const toQueryString = (params: SubscriberListParams): string => {
  const search = new URLSearchParams();
  if (params.page !== undefined) search.set("page", String(params.page));
  if (params.limit !== undefined) search.set("limit", String(params.limit));
  if (params.search) search.set("search", params.search);
  const qs = search.toString();
  return qs ? `?${qs}` : "";
};

/**
 * Public newsletter subscription. Returns the subscriber plus the server's
 * message ("You're subscribed." vs "You're already subscribed.") so the UI can
 * reflect the idempotent-upsert outcome.
 */
export const submitSubscribe = async (
  email: string,
): Promise<{ subscriber: Subscriber; message: string }> => {
  const { data } = await api.post<SubscribeEnvelope>("/subscribers", { email });
  return { subscriber: data.data.subscriber, message: data.message };
};

/** Admin list (paginated + searchable). */
export const fetchSubscribers = async (
  params: SubscriberListParams = {},
): Promise<SubscriberListResult> => {
  const { data } = await api.get<SubscriberListEnvelope>(
    `/subscribers${toQueryString(params)}`,
  );
  return data.data;
};

/** Admin: delete a subscriber. */
export const deleteSubscriber = async (id: string): Promise<void> => {
  await api.delete(`/subscribers/${id}`);
};
