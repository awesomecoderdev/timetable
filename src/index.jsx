import React, { Fragment } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

if (document.getElementById("timeTableDates") != null) {
  const root = ReactDOM.createRoot(document.getElementById("timeTableDates"));
  root.render(
    <App />
  );
}