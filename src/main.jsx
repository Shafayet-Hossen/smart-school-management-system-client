import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./index.css";
import { RegistrationProvider } from "./context/RegistrationContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RegistrationProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </RegistrationProvider>
    </QueryClientProvider>

  </React.StrictMode>
);