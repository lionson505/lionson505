import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // Adjust the path if necessary
import { AuthProvider } from "./AuthContext"; // Ensure the path is correct

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
