import { configureStore } from "@reduxjs/toolkit";
import { authReducer, tourReducer, userReducer, blogReducer } from "./slices";

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    tour: tourReducer,
    blog: blogReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: [
          "auth/signin/fulfilled",
          "user/updateProfile/fulfilled",
          "tour/createTour/fulfilled",
          "tour/updateTour/fulfilled",
          "tour/updateTourImages/fulfilled",
          "blog/createBlog/fulfilled",
          "blog/updateBlog/fulfilled",
          "blog/updateBlogImage/fulfilled",
        ],
      },
    }),
  devTools: import.meta.env.MODE !== "production",
});

export { store };