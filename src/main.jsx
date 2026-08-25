import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import "./index.css";
import { RegistrationProvider } from "./context/RegistrationContext.jsx";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <RegistrationProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </RegistrationProvider>
  </React.StrictMode>
);