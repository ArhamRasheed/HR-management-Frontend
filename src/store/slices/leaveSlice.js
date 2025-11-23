import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { leaveService } from "../../api/leaveService";

export const fetchLeaves = createAsyncThunk(
  "leaves/fetchLeaves",
  async (_, { rejectWithValue }) => {
    try {
      const response = await leaveService.fetchLeaves();
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch leaves");
    }
  }
);

const leaveSlice = createSlice({
  name: "leaves",
  initialState: {
    leaves: [],
    loading: false,
    error: null,
    searchQuery: "",
    statusFilter: "All Leave Type",
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaves.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.leaves = action.payload.leave_types || [];
      })
      .addCase(fetchLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchQuery, setStatusFilter } = leaveSlice.actions;
export default leaveSlice.reducer;

