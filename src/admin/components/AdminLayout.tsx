import { useState } from "react";
import {
  LuLayoutDashboard,
  LuFileText,
  LuMail,
  LuUsers,
  LuLogOut,
  LuMoon,
  LuSun,
  LuExternalLink,
  LuMenu,
  LuX,
} from "react-icons/lu";
import { AnimatePresence, motion } from "motion/react";
import { Link, NavLink, Outlet, ScrollRestoration } from "react-router";
import { useTheme } from "../../context/ThemeContext";
import { useAdminAuth } from "../context/AdminAuthContext";
import { useAdminData } from "../context/AdminDataContext";
import { cn } from "../../lib/utils";

const navItems = [
  { name: "Overview", path: "/admin", icon: LuLayoutDashboard, end: true },
  { name: "Blog Posts", path: "/admin/posts", icon: LuFileText, end: false },
  { name: "Messages", path: "/admin/messages", icon: LuMail, end: false },
  { name: "Subscribers", path: "/admin/subscribers", icon: LuUsers, end: false },
];

interface SidebarContentProps {
  theme: "light" | "dark";
  toggleTheme: () => void;
  logout: () => void;
  unread: number;
  onNavigate: () => void;
}

const SidebarContent = ({
  theme,
  toggleTheme,
  logout,
  unread,
  onNavigate,
}: SidebarContentProps) => (
  <div className="flex flex-col h-full">
    <Link
      to="/admin"
      onClick={onNavigate}
      className="px-8 py-8 border-b border-border"
    >
      <span className="font-serif text-2xl font-bold tracking-tight">
        Ugo<span className="text-gold">.</span>Admin
      </span>
      <p className="text-[10px] uppercase tracking-[0.3em] text-foreground/40 mt-1 font-bold">
        Control Center
      </p>
    </Link>

    <nav className="flex-1 px-4 py-8 space-y-2">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-4 px-4 py-3 text-xs uppercase tracking-widest font-bold transition-all border-l-2",
              isActive
                ? "border-gold text-gold bg-gold/5"
                : "border-transparent text-foreground/50 hover:text-foreground hover:bg-muted/5",
            )
          }
        >
          <item.icon size={18} />
          <span>{item.name}</span>
          {item.name === "Messages" && unread > 0 && (
            <span className="ml-auto bg-gold text-black text-[10px] px-2 py-0.5 rounded-full">
              {unread}
            </span>
          )}
        </NavLink>
      ))}
    </nav>

    <div className="px-4 py-6 border-t border-border space-y-2">
      <a
        href="/"
        target="_blank"
        rel="noreferrer"
        className="flex items-center gap-4 px-4 py-3 text-xs uppercase tracking-widest font-bold text-foreground/50 hover:text-gold transition-all"
      >
        <LuExternalLink size={18} />
        <span>View Site</span>
      </a>
      <button
        onClick={toggleTheme}
        className="w-full flex items-center gap-4 px-4 py-3 text-xs uppercase tracking-widest font-bold text-foreground/50 hover:text-foreground transition-all"
      >
        {theme === "light" ? <LuMoon size={18} /> : <LuSun size={18} />}
        <span>{theme === "light" ? "Dark Mode" : "Light Mode"}</span>
      </button>
      <button
        onClick={logout}
        className="w-full flex items-center gap-4 px-4 py-3 text-xs uppercase tracking-widest font-bold text-foreground/50 hover:text-red-500 transition-all"
      >
        <LuLogOut size={18} />
        <span>Logout</span>
      </button>
    </div>
  </div>
);

const AdminLayout = () => {
  const { theme, toggleTheme } = useTheme();
  const { logout } = useAdminAuth();
  const { messages } = useAdminData();
  const [mobileOpen, setMobileOpen] = useState(false);

  const unread = messages.filter((m) => !m.read).length;

  const sidebarProps = {
    theme,
    toggleTheme,
    logout,
    unread,
    onNavigate: () => setMobileOpen(false),
  };

  return (
    <div className="min-h-screen flex bg-background selection:bg-gold selection:text-black">
      {/* Desktop sidebar */}
      <aside className="w-72 shrink-0 border-r border-border bg-card fixed inset-y-0 left-0 max-medium-tablet:hidden">
        <SidebarContent {...sidebarProps} />
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 hidden max-medium-tablet:block"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-border bg-card hidden max-medium-tablet:block"
            >
              <SidebarContent {...sidebarProps} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 ml-72 max-medium-tablet:ml-0 flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="hidden max-medium-tablet:flex items-center justify-between px-4 py-4 border-b border-border bg-card sticky top-0 z-30">
          <span className="font-serif text-xl font-bold">
            Ugo<span className="text-gold">.</span>Admin
          </span>
          <button onClick={() => setMobileOpen((o) => !o)} aria-label="Menu">
            {mobileOpen ? <LuX size={24} /> : <LuMenu size={24} />}
          </button>
        </div>

        <main className="flex-1 p-12 max-tablet:p-8 max-mobile:p-4">
          <Outlet />
        </main>
        <ScrollRestoration />
      </div>
    </div>
  );
};

export default AdminLayout;
