import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { dashboardService } from "../../api/dashboardService";

const initialState = {
  dashboardData: null,
  loading: false,
  error: null,
};

const normalizeError = (error) =>
  error?.message || error || "Unable to complete the request right now.";

export const fetchDashboard = createAsyncThunk(
  "dashboard/fetch",
  /**
   * Fetch dashboard data thunk.
   *
   * @param {void} _arg
   * @param {import("@reduxjs/toolkit").ThunkAPI} thunkAPI
   */
  async (_, thunkAPI) => {
    try {
      const response = await dashboardService.fetchDashboard();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(normalizeError(error));
    }
  }
);

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    /**
     * Reset transient UI metadata.
     *
     * @param {typeof initialState} state
     */
    clearDashboardStatus(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardData = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDashboardStatus } = dashboardSlice.actions;

export default dashboardSlice.reducer;
