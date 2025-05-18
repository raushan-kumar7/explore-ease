import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const setUpInterceptors = (store) => {
  // add access token
  api.interceptors.request.use(
    (config) => {
      const token = store.getState().auth.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // handle token refresh on 401 errors
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response?.status === 401 &&
        error.response?.data?.code === "AUTH_TOKEN_EXPIRED" &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        try {
          const { refreshToken } = store.getState().auth;
          const response = await axios.post(
            `${api.defaults.baseURL}/auth/refresh-token`,
            { refreshToken },
            { withCredentials: true }
          );

          const { accessToken, refreshToken: newRefreshToken } =
            response.data.data;

          store.dispatch({
            type: "auth/refreshTokenSuccess",
            payload: { accessToken, refreshToken: newRefreshToken },
          });

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return axios(originalRequest);
        } catch (refreshError) {
          store.dispatch({ type: "auth/signout" });
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );
};

export default api;