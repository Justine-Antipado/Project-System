import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
//import Dashboard from './dashboard';
//import AdminAuth from './AdminAuth';
//import QrScannerDashboard from "./scanner";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {/*  <AdminAuth /><QrScannerDashboard /><Dashboard />*/}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
