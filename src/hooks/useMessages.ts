import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "../lib/api";
import {
  deleteMessage,
  fetchMessages,
  markMessageRead,
  messagesKeys,
  submitMessage,
} from "../api/messages.api";

// The inbox fetches everything once, then filters/paginates client-side.
const ADMIN_LIMIT = 1000;

/** No success toast: the Contact page shows its own "Inquiry Received" screen. */
export const useSubmitMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messagesKeys.all });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
};

export const useAdminMessages = () =>
  useQuery({
    queryKey: messagesKeys.admin(),
    queryFn: () => fetchMessages({ limit: ADMIN_LIMIT }),
    select: (result) => result.messages,
  });

/** No success toast: this fires on every message open. */
export const useMarkMessageRead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, read }: { id: string; read: boolean }) =>
      markMessageRead(id, read),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messagesKeys.all });
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
};

export const useDeleteMessage = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteMessage(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: messagesKeys.all });
      toast.success("Message deleted.");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
};
