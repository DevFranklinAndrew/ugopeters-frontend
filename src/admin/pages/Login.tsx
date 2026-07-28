import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LuLock, LuMail, LuArrowRight } from "react-icons/lu";
import { motion } from "motion/react";
import { Navigate, useLocation, useNavigate } from "react-router";
import { cn } from "../../lib/utils";
import { useLogin, useMe } from "../hooks/useAuth";
import { loginSchema, type LoginFormValues } from "../schemas/auth.schema";

interface LocationState {
  from?: { pathname: string };
}

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: admin } = useMe();
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const from = (location.state as LocationState)?.from?.pathname || "/admin";

  if (admin) return <Navigate to={from} replace />;

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values, {
      onSuccess: () => navigate(from, { replace: true }),
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background selection:bg-gold selection:text-black">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-12">
          <span className="font-serif text-4xl font-bold tracking-tight">
            Ugo<span className="text-gold">.</span>Admin
          </span>
          <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/40 mt-2 font-bold">
            Control Center
          </p>
        </div>

        <div className="bg-card border border-border p-10 max-mobile:p-6 shadow-2xl shadow-black/5">
          <h1 className="text-3xl font-serif font-bold mb-2">Welcome back</h1>
          <p className="text-foreground/50 mb-8 font-light">
            Sign in to manage your content.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
            noValidate
          >
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40">
                Email
              </label>
              <div
                className={cn(
                  "flex items-center gap-3 border-b transition-colors",
                  errors.email
                    ? "border-red-500 focus-within:border-red-500"
                    : "border-border focus-within:border-gold",
                )}
              >
                <LuMail size={18} className="text-foreground/40" />
                <input
                  type="email"
                  autoComplete="email"
                  {...register("email")}
                  placeholder="admin@ugopeters.com"
                  className="w-full bg-transparent py-3 focus:outline-none text-lg font-serif"
                />
              </div>
              {errors.email && (
                <p className="text-red-500 text-sm font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40">
                Password
              </label>
              <div
                className={cn(
                  "flex items-center gap-3 border-b transition-colors",
                  errors.password
                    ? "border-red-500 focus-within:border-red-500"
                    : "border-border focus-within:border-gold",
                )}
              >
                <LuLock size={18} className="text-foreground/40" />
                <input
                  type="password"
                  autoComplete="current-password"
                  {...register("password")}
                  placeholder="••••••••"
                  className="w-full bg-transparent py-3 focus:outline-none text-lg font-serif"
                />
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm font-medium">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full px-8 py-4 bg-gold text-black font-bold uppercase tracking-widest text-sm hover:bg-gold-light transition-all shadow-xl shadow-gold/10 flex items-center justify-center gap-3 group disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loginMutation.isPending ? "Signing in…" : "Sign In"}
              <LuArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
