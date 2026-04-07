import { createBrowserRouter, RouterProvider } from "react-router";
import Layout from "./components/Layout";
import { ThemeContextProvider } from "./context/ThemeContext";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import Contact from "./pages/Contact";
import Home from "./pages/Home";
import Portfolio from "./pages/Portfolio";

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
]);

const App = () => {
  return (
    <ThemeContextProvider>
      <RouterProvider router={router} />
    </ThemeContextProvider>
  );
};
export default App;
