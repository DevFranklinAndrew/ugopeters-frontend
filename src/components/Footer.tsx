import { Camera, Link2, Mail, MapPin } from "lucide-react";
import { Link } from "react-router";
import { useTheme } from "../context/ThemeContext";
import Udark from "../assets/Dark Logo.png";
import ULight from "../assets/Light Logo.png";

const Footer = () => {
  const { theme } = useTheme();
  return (
    <footer className="bg-background border-t border-border pt-20 pb-10 px-12 max-mobile:px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-5 max-small-tablet:grid-cols-2 max-small-mobile:grid-cols-1 gap-12 mb-20">
        <div className="col-span-2 max-small-mobile:col-span-1">
          <Link to="/">
            {theme === "light" ? (
              <img src={Udark} alt="Ugo Peters Dark Logo" className="h-14" />
            ) : (
              <img src={ULight} alt="Ugo Peters Dark Logo" className="h-14" />
            )}
          </Link>
          <p className="text-foreground/50 max-w-md mb-8 leading-relaxed">
            Real Estate Strategist, Business Innovator, and Executive Mentor.
            Driving high-impact outcomes for investors and corporate
            stakeholders through strategic foresight and innovative leadership.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-gold hover:text-gold transition-all"
            >
              <Mail size={18} />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-gold hover:text-gold transition-all"
            >
              <Link2 size={18} />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:border-gold hover:text-gold transition-all"
            >
              <Camera size={18} />
            </a>
          </div>
        </div>

        <div>
          <h4 className="text-gold uppercase tracking-widest text-xs font-bold mb-6">
            Navigation
          </h4>
          <ul className="flex flex-col gap-4">
            <li>
              <Link
                to="/"
                className="text-foreground/70 hover:text-gold transition-colors text-sm"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="text-foreground/70 hover:text-gold transition-colors text-sm"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/portfolio"
                className="text-foreground/70 hover:text-gold transition-colors text-sm"
              >
                Portfolio
              </Link>
            </li>
            <li>
              <Link
                to="/blog"
                className="text-foreground/70 hover:text-gold transition-colors text-sm"
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className="text-foreground/70 hover:text-gold transition-colors text-sm"
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div className="col-span-2 max-small-mobile:col-span-1">
          <h4 className="text-gold uppercase tracking-widest text-xs font-bold mb-6">
            Contact
          </h4>
          <ul className="flex flex-col gap-4">
            <li className="flex items-center gap-3 text-foreground/70 text-sm">
              <MapPin size={16} className="text-gold shrink-0" />
              <span>Abuja, Nigeria</span>
            </li>
            <li className="flex items-center gap-3 text-foreground/70 text-sm">
              <Mail size={16} className="text-gold shrink-0" />
              <span>executive@ugopeters.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-10 border-t border-border flex max-medium-mobile:flex-col justify-between items-center gap-4 text-foreground/30 uppercase tracking-widest text-left text-[10px]">
        <p>&copy; 2026 UGO PETERS. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-foreground transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
