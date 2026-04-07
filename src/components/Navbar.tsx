import { Menu, Moon, Sun, X } from "lucide-react";
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
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
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
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button
            className="text-foreground"
            onClick={() => setIsOpen((open) => !open)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 w-full bg-background border-b border-border overflow-hidden"
          >
            <div className="p-6 hidden max-small-tablet:flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link
                  to={link.path}
                  key={link.path}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "text-lg uppercase tracking-widest",
                    location.pathname === link.path
                      ? "text-gold"
                      : "text-foreground/70",
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/contact"
                onClick={() => setIsOpen(false)}
                className="w-full py-4 bg-gold text-black text-center font-bold uppercase tracking-widest text-sm"
              >
                Book Consultation
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
export default Navbar;
