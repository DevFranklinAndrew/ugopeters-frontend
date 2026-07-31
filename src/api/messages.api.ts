import { api } from "../lib/api";

/**
 * A contact-form submission. Mirrors the backend `toPublicMessage` shape
 * (backend/src/controllers/message.controller.ts). This is the single source of
 * truth for the message type across the app (public form + admin inbox).
 */
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

/** The client-supplied fields for the public contact form. */
export type ContactMessageInput = Pick<
  ContactMessage,
  "name" | "email" | "reason" | "subject" | "message"
>;

/** Query params accepted by `GET /api/messages` (server-side paging + filtering). */
export interface MessageListParams {
  page?: number;
  limit?: number;
  reason?: string;
  read?: boolean;
}

/** Pagination metadata returned alongside a list of messages. */
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

/** Centralized React Query keys for the messages resource. */
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

/** Serializes list params to a query string, dropping undefined values. */
const toQueryString = (params: MessageListParams): string => {
  const search = new URLSearchParams();
  if (params.page !== undefined) search.set("page", String(params.page));
  if (params.limit !== undefined) search.set("limit", String(params.limit));
  if (params.reason) search.set("reason", params.reason);
  if (params.read !== undefined) search.set("read", String(params.read));
  const qs = search.toString();
  return qs ? `?${qs}` : "";
};

/** Public contact-form submission. */
export const submitMessage = async (
  payload: ContactMessageInput,
): Promise<ContactMessage> => {
  const { data } = await api.post<MessageEnvelope>("/messages", payload);
  return data.data.message;
};

/** Admin inbox list (paginated + filterable). */
export const fetchMessages = async (
  params: MessageListParams = {},
): Promise<MessageListResult> => {
  const { data } = await api.get<MessageListEnvelope>(
    `/messages${toQueryString(params)}`,
  );
  return data.data;
};

/** Admin: toggle a message's read status. */
export const markMessageRead = async (
  id: string,
  read: boolean,
): Promise<ContactMessage> => {
  const { data } = await api.patch<MessageEnvelope>(`/messages/${id}`, { read });
  return data.data.message;
};

/** Admin: delete a message. */
export const deleteMessage = async (id: string): Promise<void> => {
  await api.delete(`/messages/${id}`);
};
