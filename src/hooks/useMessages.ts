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

// The admin inbox fetches everything once, then sorts/filters/paginates on the
// client (see Messages.tsx) — matching the useAdminPosts pattern.
const ADMIN_LIMIT = 1000;

/**
 * Public contact-form submission. Feedback is the Contact page's "Inquiry
 * Received" screen, so no success toast here — only surface server errors.
 */
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

/** All messages for the admin inbox. */
export const useAdminMessages = () =>
  useQuery({
    queryKey: messagesKeys.admin(),
    queryFn: () => fetchMessages({ limit: ADMIN_LIMIT }),
    select: (result) => result.messages,
  });

/** Toggle read/unread. No success toast — this fires often (auto-read on open). */
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
