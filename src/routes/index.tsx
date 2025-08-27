import App from "@/App";
import About from "@/pages/About";
import AdminDashboard from "@/pages/dashboard/admin/dashboard";
import ParcelManagementPage from "@/pages/dashboard/admin/parcel-dashboard";
import UserManagementPage from "@/pages/dashboard/admin/user-dashboard";
import Contact from "@/pages/Contact";
import ForgotPasswordPage from "@/pages/auth/ForgotPassword";
import HomePage from "@/pages/Home";
import LoginPage from "@/pages/auth/Login";
import NotFound from "@/pages/NotFound";
import ProfilePage from "@/pages/Profile";
import ReceiverDashboard from "@/pages/dashboard/receiver/receiver-page";
import RegisterPage from "@/pages/auth/Register";
import CreateParcelPage from "@/pages/dashboard/sender/CreateParcel";
import SenderDashboard from "@/pages/dashboard/sender/dashboard";
import TrackPage from "@/pages/Track";
import VerifyPage from "@/pages/auth/Verify";
import { createBrowserRouter } from "react-router";
import ResetPassword from "@/pages/auth/ResetPassword";

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
      {
        path: "/forgot-password",
        Component: ForgotPasswordPage,
      },
      {
        path: "/reset-password",
        Component: ResetPassword,
      },
      {
        path: "/profile",
        Component: ProfilePage,
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
        path: "/dashboard/receiver",
        Component: ReceiverDashboard,
      },
      {
        path: "/dashboard/admin",
        Component: AdminDashboard,
      },
      {
        path: "/dashboard/admin/create",
        Component: CreateParcelPage,
      },
      {
        path: "/dashboard/admin/users",
        Component: UserManagementPage,
      },
      {
        path: "/dashboard/admin/parcels",
        Component: ParcelManagementPage,
      },
    ],
  },
  {
    path: "*",
    Component: NotFound,
  },
]);
