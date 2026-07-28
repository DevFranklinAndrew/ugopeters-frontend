import { QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router";
import { Toaster } from "sonner";
import Layout from "./components/Layout";
import { queryClient } from "./lib/queryClient";
import { ThemeContextProvider } from "./context/ThemeContext";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";
import { AdminDataProvider } from "./admin/context/AdminDataContext";
import ProtectedRoute from "./admin/components/ProtectedRoute";
import AdminLayout from "./admin/components/AdminLayout";
import Login from "./admin/pages/Login";
import Overview from "./admin/pages/Overview";
import Posts from "./admin/pages/Posts";
import PostEditor from "./admin/pages/PostEditor";
import PostView from "./admin/pages/PostView";
import Messages from "./admin/pages/Messages";
import Subscribers from "./admin/pages/Subscribers";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      { path: "portfolio", element: <Portfolio /> },
      { path: "blog", element: <Blog /> },
      { path: "blog/:slug", element: <BlogDetail /> },
      { path: "contact", element: <Contact /> },
    ],
  },
  { path: "/admin/login", element: <Login /> },
  {
    path: "/admin",
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true, element: <Overview /> },
          { path: "posts", element: <Posts /> },
          { path: "posts/new", element: <PostEditor /> },
          { path: "posts/:id", element: <PostView /> },
          { path: "posts/:id/edit", element: <PostEditor /> },
          { path: "messages", element: <Messages /> },
          { path: "subscribers", element: <Subscribers /> },
        ],
      },
    ],
  },
]);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContextProvider>
        <AdminDataProvider>
          <RouterProvider router={router} />
        </AdminDataProvider>
      </ThemeContextProvider>
      <Toaster
        position="top-center"
        theme="system"
        style={{ fontFamily: "var(--font-sans)" }}
        toastOptions={{
          classNames: {
            toast: "bg-card border border-border text-foreground font-sans",
            title: "text-foreground font-sans",
            description: "text-foreground/70 font-sans",
          },
        }}
      />
    </QueryClientProvider>
  );
};
export default App;
