import { api } from "../../lib/api";
import type { LoginFormValues } from "../schemas/auth.schema";

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
}

/** Envelope returned by the auth endpoints: { status, data: { admin } }. */
interface AdminEnvelope {
  data: { admin: Admin };
}

/** React Query key for the current-admin session. */
export const ME_QUERY_KEY = ["admin", "me"];

export const login = async (payload: LoginFormValues): Promise<Admin> => {
  const { data } = await api.post<AdminEnvelope>("/admin/login", payload);
  return data.data.admin;
};

export const logout = async (): Promise<void> => {
  await api.post("/admin/logout");
};

export const fetchMe = async (): Promise<Admin> => {
  const { data } = await api.get<AdminEnvelope>("/admin/me");
  return data.data.admin;
};
