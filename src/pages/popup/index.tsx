import React from "react";
import ReactDOM from "react-dom/client";
import Popup from "./content";
import { AppStateProvider } from "./state";

ReactDOM.createRoot(document.body).render(
  <React.StrictMode>
    <AppStateProvider>
      <Popup />
    </AppStateProvider>
  </React.StrictMode>
);
