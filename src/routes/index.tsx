import App from "@/App";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import HomePage from "@/pages/Home";
import TrackPage from "@/pages/Track";
import { createBrowserRouter } from "react-router";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: "/about",
        Component: About,
      },
      {
        path: "/contact",
        Component: Contact,
      },
      {
        path: "/track",
        Component: TrackPage,
      },
    ],
  },
]);
