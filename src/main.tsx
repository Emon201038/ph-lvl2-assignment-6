import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./features/store.ts";
import { RouterProvider } from "react-router";
import { router } from "./routes/index.tsx";
import { Toaster } from "sonner";
import { ThemeProvider } from "./providers/theme-provider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReduxProvider store={store}>
      <ThemeProvider defaultTheme="system" storageKey="theme">
        <RouterProvider router={router} />
        <Toaster richColors />
      </ThemeProvider>
    </ReduxProvider>
  </StrictMode>
);
