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
        {/* Opacity only, and no exit animation — both deliberate:
            - A y-offset reads as a bounce, and any transform here would make
              this the containing block for fixed elements inside a page.
            - `<Outlet />` resolves against the router's *current* route, so an
              exiting wrapper would flash the new page's content before fading. */}
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
