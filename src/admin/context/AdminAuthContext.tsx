import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

/**
 * Mocked admin auth. Validates against placeholder credentials and persists a
 * flag in localStorage. When the backend exists, replace `login` with a real
 * POST /api/admin/login call and store the returned JWT instead.
 */

// Placeholder credentials — REPLACE with real auth once the backend is built.
const PLACEHOLDER_EMAIL = "admin@ugopeters.com";
const PLACEHOLDER_PASSWORD = "admin123";

const STORAGE_KEY = "admin_auth";

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(
  undefined,
);

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => localStorage.getItem(STORAGE_KEY) === "true",
  );

  const login: AdminAuthContextType["login"] = (email, password) => {
    if (
      email.trim().toLowerCase() === PLACEHOLDER_EMAIL &&
      password === PLACEHOLDER_PASSWORD
    ) {
      localStorage.setItem(STORAGE_KEY, "true");
      setIsAuthenticated(true);
      return { ok: true };
    }
    return { ok: false, error: "Invalid credentials. Please try again." };
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined)
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  return context;
};

export const PLACEHOLDER_CREDENTIALS = {
  email: PLACEHOLDER_EMAIL,
  password: PLACEHOLDER_PASSWORD,
};
