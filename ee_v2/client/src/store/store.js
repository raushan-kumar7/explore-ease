import { configureStore } from "@reduxjs/toolkit";
import { authReducer, userReducer } from "./slices";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: [
          "auth/signin/fulfilled",
          "user/updateProfile/fulfilled",
        ],
      },
    }),
  devTools: import.meta.env.MODE !== "production",
});

export { store };