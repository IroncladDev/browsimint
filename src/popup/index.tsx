import { ToastProvider } from "@common/ui/toast"
import { Toaster } from "@common/ui/toaster"
import React from "react"
import ReactDOM from "react-dom/client"
import { AppStateProvider } from "./components/app-state-provider"
import Popup from "./components/(screens)"

ReactDOM.createRoot(document.body).render(
  <React.StrictMode>
    <ToastProvider>
      <AppStateProvider>
        <Popup />
        <div id="dialog-root" />
      </AppStateProvider>
      <Toaster />
    </ToastProvider>
  </React.StrictMode>,
)
