import { api } from "../lib/api";

/** Mirrors the backend `toPublicSubscriber`; the app's single source of truth
 *  for this type, used by both the public form and the admin page. */
export interface Subscriber {
  id: string;
  email: string;
  createdAt: string; // ISO string
}

export interface SubscriberListParams {
  page?: number;
  limit?: number;
  search?: string;
}

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

const toQueryString = (params: SubscriberListParams): string => {
  const search = new URLSearchParams();
  if (params.page !== undefined) search.set("page", String(params.page));
  if (params.limit !== undefined) search.set("limit", String(params.limit));
  if (params.search) search.set("search", params.search);
  const qs = search.toString();
  return qs ? `?${qs}` : "";
};

/** Returns the server's message too ("You're subscribed." vs "You're already
 *  subscribed.") so the UI can reflect the idempotent-upsert outcome. */
export const submitSubscribe = async (
  email: string,
): Promise<{ subscriber: Subscriber; message: string }> => {
  const { data } = await api.post<SubscribeEnvelope>("/subscribers", { email });
  return { subscriber: data.data.subscriber, message: data.message };
};

export const fetchSubscribers = async (
  params: SubscriberListParams = {},
): Promise<SubscriberListResult> => {
  const { data } = await api.get<SubscriberListEnvelope>(
    `/subscribers${toQueryString(params)}`,
  );
  return data.data;
};

export const deleteSubscriber = async (id: string): Promise<void> => {
  await api.delete(`/subscribers/${id}`);
};
