import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./style.css"
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { UserProvider } from "./context/UserContext.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("Root element not found");

createRoot(rootElement).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <UserProvider>
        <SocketProvider>
          <AppWrapper>
            <App />
          <Toaster
            position="top-right"

            toastOptions={{
              duration: 4000,
              success: {
                style: {
                  background: "#172C53", // your brand primary for success
                  color: "#fff",
                },
              },
              error: {
                style: {
                  background: "#D02030", // brand red for errors
                  color: "#fff",
                },
              },
            }}
          />
        </AppWrapper>
      </SocketProvider>
    </UserProvider>
  </ThemeProvider>
  </QueryClientProvider>
);
