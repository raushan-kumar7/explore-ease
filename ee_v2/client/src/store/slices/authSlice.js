/* eslint-disable no-unused-vars */
import { authService } from "@/services";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


// Initial state
const initialState = {
  isAuthenticated: false,
  user: null,
  token: localStorage.getItem("token") || null,
  refreshToken: localStorage.getItem("refreshToken") || null,
  loading: false,
  error: null,
};

// Async thunks
export const signup = createAsyncThunk(
  "auth/signup",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authService.signup(userData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  }
);

export const signin = createAsyncThunk(
  "auth/signin",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authService.signin(credentials);
      const { accessToken, refreshToken, user } = response.data.data;
      
      // Store tokens in localStorage
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      
      return { user, accessToken, refreshToken };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const signout = createAsyncThunk(
  "auth/signout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.signout();
      
      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      
      return null;
    } catch (error) {
      // Still remove tokens on error
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      
      return rejectWithValue(error.response?.data?.message || "Logout failed");
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authService.getCurrentUser();
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch user data");
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email, frontendResetUrl }, { rejectWithValue }) => {
    try {
      const response = await authService.forgotPassword(email, frontendResetUrl);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to process request");
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const response = await authService.resetPassword(token, newPassword);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Password reset failed");
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async ({ oldPassword, newPassword }, { rejectWithValue }) => {
    try {
      const response = await authService.changePassword(oldPassword, newPassword);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Password change failed");
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
    },
    refreshTokenSuccess: (state, action) => {
      state.token = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      
      // Update localStorage
      localStorage.setItem("token", action.payload.accessToken);
      localStorage.setItem("refreshToken", action.payload.refreshToken);
    },
  },
  extraReducers: (builder) => {
    builder
      // Sign up
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Sign in
      .addCase(signin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signin.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(signin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Sign out
      .addCase(signout.pending, (state) => {
        state.loading = true;
      })
      .addCase(signout.fulfilled, (state) => {
        // Reset state to initial values
        return {
          ...initialState,
          token: null,
          refreshToken: null,
        };
      })
      .addCase(signout.rejected, (state) => {
        // Reset important auth state even if API call fails
        return {
          ...initialState,
          token: null,
          refreshToken: null,
        };
      })
      
      // Get current user
      .addCase(getCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // Failed to fetch user could mean invalid token
        if (action.payload?.includes("Unauthorized")) {
          state.isAuthenticated = false;
          state.user = null;
        }
      })
      
      // Password operations status handling
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearErrors, refreshTokenSuccess } = authSlice.actions;
export default authSlice.reducer;