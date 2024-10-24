import { ToastProvider } from "@common/ui/toast"
import { Toaster } from "@common/ui/toaster"
import React from "react"
import ReactDOM from "react-dom/client"
import Popup from "./content"
import { AppStateProvider } from "./state"

ReactDOM.createRoot(document.body).render(
  <React.StrictMode>
    <ToastProvider>
      <AppStateProvider>
        <Popup />
      </AppStateProvider>
      <Toaster />
    </ToastProvider>
  </React.StrictMode>,
)
