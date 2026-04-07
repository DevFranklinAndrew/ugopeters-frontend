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
        {/* <AnimatePresence mode="wait"> */}
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Outlet />
          <ScrollRestoration />
        </motion.div>
        {/* </AnimatePresence> */}
      </main>
      <Footer />
    </div>
  );
};
export default Layout;
