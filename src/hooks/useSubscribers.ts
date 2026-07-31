import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "../lib/api";
import {
  deleteSubscriber,
  fetchSubscribers,
  submitSubscribe,
  subscribersKeys,
} from "../api/subscribers.api";

// The admin page fetches everything once, then searches/filters/paginates on
// the client (see Subscribers.tsx) — matching the useAdminMessages pattern.
const ADMIN_LIMIT = 1000;

/**
 * Public newsletter subscription. Toasts the server's message so the idempotent
 * outcome ("You're subscribed." vs "You're already subscribed.") is visible.
 */
export const useSubscribe = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (email: string) => submitSubscribe(email),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: subscribersKeys.all });
      toast.success(result.message);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
};

/** All subscribers for the admin page. */
export const useAdminSubscribers = () =>
  useQuery({
    queryKey: subscribersKeys.admin(),
    queryFn: () => fetchSubscribers({ limit: ADMIN_LIMIT }),
    select: (result) => result.subscribers,
  });

export const useDeleteSubscriber = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSubscriber(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: subscribersKeys.all });
      toast.success("Subscriber removed.");
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
};
