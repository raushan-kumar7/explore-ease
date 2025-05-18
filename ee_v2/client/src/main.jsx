import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Toaster } from "react-hot-toast";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import MainRoutes from "./routes/MainRoutes";
import { store } from "./store/store";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <Toaster position="top-right" />
      <RouterProvider router={MainRoutes} />
    </Provider>
  </StrictMode>
);