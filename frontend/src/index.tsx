import React from "react";
import ReactDOM from "react-dom/client";
import { io, Socket } from "socket.io-client";
import App from "./App";
import { ErrorBoundary } from "./components/ErrorBoundary";
import "./index.css";
import reportWebVitals from "./reportWebVitals";

export const socket: Socket = io(process.env.REACT_APP_BACKEND_URL, {
  path: "/api/socket.io",
  transports: ["websocket", "polling"],
});

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
