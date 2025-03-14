import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import Providers from "./context/Providers"

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <Providers>
    <App />
  </Providers>
)

reportWebVitals()
