import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import UserContextProvider from "./usecontext/usercontext";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <UserContextProvider>
    <BrowserRouter>
      <GoogleOAuthProvider clientId="396640095596-k775dv03ttqvoulfkhheclnutmm9vsav.apps.googleusercontent.com">
        <App />
      </GoogleOAuthProvider>
    </BrowserRouter>
  </UserContextProvider>
);
