import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
//import Dashboard from './dashboard';
//import Auth from './auth';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* <Auth /> <Dashboard />*/}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
