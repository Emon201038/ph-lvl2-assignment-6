import App from "@/App";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import HomePage from "@/pages/Home";
import LoginPage from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import RegisterPage from "@/pages/Register";
import CreateParcelPage from "@/pages/sender/CreateParcel";
import SenderDashboard from "@/pages/sender/dashboard";
import TrackPage from "@/pages/Track";
import VerifyPage from "@/pages/Verify";
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
      {
        path: "/login",
        Component: LoginPage,
      },
      {
        path: "/register",
        Component: RegisterPage,
      },
      {
        path: "/verify",
        Component: VerifyPage,
      },
    ],
  },
  {
    path: "/",
    Component: App,
    children: [
      {
        path: "/dashboard/sender",
        Component: SenderDashboard,
      },
      {
        path: "/dashboard/sender/create",
        Component: CreateParcelPage,
      },
      {
        path: "/receiver",
        Component: HomePage,
      },
      {
        path: "/admin",
        Component: HomePage,
      },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
