import { useState, type FormEvent } from "react";
import { LuLock, LuMail, LuArrowRight } from "react-icons/lu";
import { motion } from "motion/react";
import { Navigate, useLocation, useNavigate } from "react-router";
import {
  PLACEHOLDER_CREDENTIALS,
  useAdminAuth,
} from "../context/AdminAuthContext";

interface LocationState {
  from?: { pathname: string };
}

const Login = () => {
  const { isAuthenticated, login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as LocationState)?.from?.pathname || "/admin";

  if (isAuthenticated) return <Navigate to={from} replace />;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    const result = login(email, password);
    if (result.ok) {
      navigate(from, { replace: true });
    } else {
      setError(result.error ?? "Login failed.");
    }
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

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40">
                Email
              </label>
              <div className="flex items-center gap-3 border-b border-border focus-within:border-gold transition-colors">
                <LuMail size={18} className="text-foreground/40" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ugopeters.com"
                  className="w-full bg-transparent py-3 focus:outline-none text-lg font-serif"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-foreground/40">
                Password
              </label>
              <div className="flex items-center gap-3 border-b border-border focus-within:border-gold transition-colors">
                <LuLock size={18} className="text-foreground/40" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent py-3 focus:outline-none text-lg font-serif"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm font-medium">{error}</p>
            )}

            <button
              type="submit"
              className="w-full px-8 py-4 bg-gold text-black font-bold uppercase tracking-widest text-sm hover:bg-gold-light transition-all shadow-xl shadow-gold/10 flex items-center justify-center gap-3 group"
            >
              Sign In
              <LuArrowRight
                size={18}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </form>

          {/* Placeholder credentials hint — remove once real auth is wired. */}
          <div className="mt-8 p-4 bg-muted/5 border border-border text-xs text-foreground/50">
            <p className="font-bold uppercase tracking-widest text-[10px] text-gold mb-2">
              Demo credentials
            </p>
            <p>Email: {PLACEHOLDER_CREDENTIALS.email}</p>
            <p>Password: {PLACEHOLDER_CREDENTIALS.password}</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
