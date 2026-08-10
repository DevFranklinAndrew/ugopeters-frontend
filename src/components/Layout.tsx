import { motion } from "motion/react";
import { Outlet, ScrollRestoration, useLocation } from "react-router";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Layout = () => {
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col selection:bg-gold selection:text-black">
      <Navbar />
      <main className="grow">
        {/* A plain opacity fade on the incoming page.
            - No y-offset: the slide is what read as a jump/bounce. Animating
              opacity alone also stops motion from writing a `transform` here,
              which would otherwise make this the containing block for any
              `position: fixed` element rendered inside a page.
            - No AnimatePresence/exit: `<Outlet />` resolves against the router's
              *current* route, so an exiting wrapper would re-render showing the
              NEW page's content — the outgoing page would flash the new content
              before fading. A fade-in on the incoming page avoids that entirely. */}
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <Outlet />
          <ScrollRestoration />
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};
export default Layout;
