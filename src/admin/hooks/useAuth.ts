import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { getApiErrorMessage } from "../../lib/api";
import { fetchMe, login, logout, ME_QUERY_KEY } from "../api/auth.api";

export const useMe = () =>
  useQuery({
    queryKey: ME_QUERY_KEY,
    queryFn: fetchMe,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (admin) => {
      queryClient.setQueryData(ME_QUERY_KEY, admin);
      toast.success(`Welcome back, ${admin.name}.`);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const goToLogin = () => {
    queryClient.removeQueries({ queryKey: ME_QUERY_KEY });
    navigate("/admin/login", { replace: true });
  };

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      goToLogin();
      toast.success("Signed out.");
    },
    onError: (error) => {
      goToLogin();
      toast.error(getApiErrorMessage(error));
    },
  });
};
