import { createBrowserRouter } from "react-router";
import { RootLayout } from "@/components/layout/RootLayout";
import Home from "@/pages/Home";
import Work from "@/pages/Work";
import CaseStudy from "@/pages/CaseStudy";
import About from "@/pages/About";
import Lab from "@/pages/Lab";
import Contact from "@/pages/Contact";
import NotFound from "@/pages/NotFound";

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/work", element: <Work /> },
      { path: "/work/:slug", element: <CaseStudy /> },
      { path: "/about", element: <About /> },
      { path: "/lab", element: <Lab /> },
      { path: "/contact", element: <Contact /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);
