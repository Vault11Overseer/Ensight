// frontend/src/main.jsx
// DONE

// MAIN
// IMPORTS
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./App.css";
import {UserDataProvider} from "./services/UserDataContext"

// BROWSER ROUTER WRAPPER
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserDataProvider>
    <App />
    </UserDataProvider>
  </React.StrictMode>
);
