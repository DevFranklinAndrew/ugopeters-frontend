import { LuMenu, LuMoon, LuSun, LuX } from "react-icons/lu";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import Udark from "../assets/Dark Logo.png";
import ULight from "../assets/Light Logo.png";
import { useTheme } from "../context/ThemeContext";
import { cn } from "../lib/utils";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
  { name: "Portfolio", path: "/portfolio" },
  { name: "Blog", path: "/blog" },
  { name: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // While the mobile menu is open, lock body scroll and allow Escape to close.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 w-full z-50 transition-all border-border duration-300 px-12 max-mobile:px-4 py-2",
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b"
          : "bg-transparent",
      )}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/">
          {theme === "light" ? (
            <img src={Udark} alt="Ugo Peters Dark Logo" className="h-14" />
          ) : (
            <img src={ULight} alt="Ugo Peters Dark Logo" className="h-14" />
          )}
        </Link>

        <div className="flex items-center gap-8 max-small-tablet:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "text-xs uppercase tracking-widest transition-colors hover:text-gold",
                location.pathname === link.path
                  ? "text-gold font-semibold"
                  : "text-foreground/70",
              )}
            >
              {link.name}
            </Link>
          ))}

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-muted/10 transition-colors text-foreground"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <LuMoon size={18} /> : <LuSun size={18} />}
          </button>

          <Link
            to="/contact"
            className="px-6 py-2 border border-gold text-gold text-xs uppercase tracking-widest hover:bg-gold hover:text-black transition-all duration-300"
          >
            Consultation
          </Link>
        </div>

        <div className="hidden max-small-tablet:flex items-center gap-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-muted/10 transition-colors text-foreground"
            aria-label="Toggle theme"
          >
            {theme === "light" ? <LuMoon size={20} /> : <LuSun size={20} />}
          </button>
          <button
            className="text-foreground"
            onClick={() => setIsOpen(true)}
            aria-label="Open menu"
          >
            <LuMenu size={24} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dimmed, blurred overlay — click to dismiss */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              aria-hidden="true"
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm hidden max-small-tablet:block"
            />

            {/* Left slide-in sidebar */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              className="fixed inset-y-0 left-0 z-50 w-72 max-small-mobile:w-full bg-background border-r border-border shadow-2xl shadow-black/20 hidden max-small-tablet:flex flex-col"
            >
              {/* Header: logo + close */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <img
                  src={theme === "light" ? Udark : ULight}
                  alt="Ugo Peters"
                  className="h-12"
                />
                <button
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                  className="p-2 text-foreground hover:text-gold transition-colors"
                >
                  <LuX size={24} />
                </button>
              </div>

              {/* Links */}
              <div className="flex flex-col gap-1 p-4 grow">
                {navLinks.map((link) => (
                  <Link
                    to={link.path}
                    key={link.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "px-4 py-3 text-sm uppercase tracking-widest border-l-2 transition-colors",
                      location.pathname === link.path
                        ? "text-gold border-gold bg-gold/5 font-semibold"
                        : "text-foreground/70 border-transparent hover:text-gold hover:border-gold/40",
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              {/* Footer CTA */}
              <div className="p-4 border-t border-border">
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="block w-full py-4 bg-gold text-black text-center font-bold uppercase tracking-widest text-sm hover:bg-gold-light transition-all"
                >
                  Book Consultation
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};
export default Navbar;
