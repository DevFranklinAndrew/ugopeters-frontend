import { api } from "../lib/api";

/** Mirrors the backend `toPublicMessage`; the app's single source of truth for
 *  this type, used by both the public form and the admin inbox. */
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  reason: string;
  subject: string;
  message: string;
  read: boolean;
  createdAt: string; // ISO string
}

export type ContactMessageInput = Pick<
  ContactMessage,
  "name" | "email" | "reason" | "subject" | "message"
>;

export interface MessageListParams {
  page?: number;
  limit?: number;
  reason?: string;
  read?: boolean;
}

export interface MessagePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface MessageListResult {
  messages: ContactMessage[];
  pagination: MessagePagination;
}

export const messagesKeys = {
  all: ["messages"] as const,
  list: (params: MessageListParams) => ["messages", "list", params] as const,
  admin: () => ["messages", "admin"] as const,
};

interface MessageEnvelope {
  data: { message: ContactMessage };
}
interface MessageListEnvelope {
  data: MessageListResult;
}

const toQueryString = (params: MessageListParams): string => {
  const search = new URLSearchParams();
  if (params.page !== undefined) search.set("page", String(params.page));
  if (params.limit !== undefined) search.set("limit", String(params.limit));
  if (params.reason) search.set("reason", params.reason);
  if (params.read !== undefined) search.set("read", String(params.read));
  const qs = search.toString();
  return qs ? `?${qs}` : "";
};

export const submitMessage = async (
  payload: ContactMessageInput,
): Promise<ContactMessage> => {
  const { data } = await api.post<MessageEnvelope>("/messages", payload);
  return data.data.message;
};

export const fetchMessages = async (
  params: MessageListParams = {},
): Promise<MessageListResult> => {
  const { data } = await api.get<MessageListEnvelope>(
    `/messages${toQueryString(params)}`,
  );
  return data.data;
};

export const markMessageRead = async (
  id: string,
  read: boolean,
): Promise<ContactMessage> => {
  const { data } = await api.patch<MessageEnvelope>(`/messages/${id}`, { read });
  return data.data.message;
};

export const deleteMessage = async (id: string): Promise<void> => {
  await api.delete(`/messages/${id}`);
};
