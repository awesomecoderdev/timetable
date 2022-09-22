import React, { Fragment } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

if (document.getElementById("awesomecoderMetabox") != null) {
  const root = ReactDOM.createRoot(document.getElementById("awesomecoderMetabox"));
  root.render(
    <App />
  );
}