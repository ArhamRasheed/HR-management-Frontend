import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authService } from "../../api/authService";

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  initialized: false,
  error: null,
  statusMessage: null,
};

const normalizeError = (error) =>
  error?.message || error || "Something went wrong. Please try again.";

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  /**
   * Login thunk.
   *
   * @param {{ email: string; password: string }} credentials
   * @param {import("@reduxjs/toolkit").ThunkAPI} thunkAPI
   */
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await authService.login(email, password);
      if (!response.success) {
        throw new Error(response.message || "Invalid credentials");
      }

      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(normalizeError(error));
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  /**
   * Logout thunk.
   *
   * @param {void} _arg
   * @param {import("@reduxjs/toolkit").ThunkAPI} thunkAPI
   */
  async (_, thunkAPI) => {
    try {
      const response = await authService.logout();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(normalizeError(error));
    }
  }
);

export const checkSession = createAsyncThunk(
  "auth/checkSession",
  /**
   * Session validation thunk.
   *
   * @param {void} _arg
   * @param {import("@reduxjs/toolkit").ThunkAPI} thunkAPI
   */
  async (_, thunkAPI) => {
    try {
      const response = await authService.checkSession();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(normalizeError(error));
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    /**
     * Clear user-facing auth messages.
     *
     * @param {typeof initialState} state
     */
    clearAuthFeedback(state) {
      state.error = null;
      state.statusMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.statusMessage = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        console.log('✅ AUTHSLICE - Login fulfilled - payload:', action.payload);
        console.log('✅ AUTHSLICE - User data:', action.payload.user);
        
        state.loading = false;
        // Store complete user object from API response (includes: id, email, full_name, department)
        // Note: The backend returns user.department, not user.role
        state.user = action.payload.user || null;
        state.isAuthenticated = Boolean(
          action.payload.success ?? action.payload.authenticated ?? action.payload.user
        );
        state.initialized = true;
        state.error = null;
        state.statusMessage = action.payload.message || "Login successful.";
        
        console.log('✅ AUTHSLICE - New state:', {
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          initialized: state.initialized
        });
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.error = action.payload || "Unable to login right now.";
        state.statusMessage = null;
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.statusMessage = null;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.statusMessage =
          action.payload?.message || "Logged out successfully.";
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Unable to logout.";
      })
      .addCase(checkSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkSession.fulfilled, (state, action) => {
        state.loading = false;
        state.initialized = true;
        // Store complete user object from session check (includes: id, email, full_name, department)
        // Note: The backend returns user.department, not user.role
        state.user = action.payload.user || null;
        state.isAuthenticated = Boolean(action.payload.authenticated);
        state.statusMessage = null;
        if (!action.payload.authenticated) {
          state.user = null;
          state.isAuthenticated = false;
        }
      })
      .addCase(checkSession.rejected, (state, action) => {
        state.loading = false;
        state.initialized = true;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload || "Unable to verify session.";
      });
  },
});

export const { clearAuthFeedback } = authSlice.actions;

export default authSlice.reducer;
