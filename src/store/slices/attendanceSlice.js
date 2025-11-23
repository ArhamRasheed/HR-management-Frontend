import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { attendanceService } from "../../api/attendanceService";

/**
 * Helper function to filter attendances
 */
function filterAttendances(state) {
  let filtered = state.attendances;

  // Filter by search query (employee name)
  if (state.searchQuery) {
    filtered = filtered.filter((att) =>
      att.employee_name?.toLowerCase().includes(state.searchQuery.toLowerCase())
    );
  }

  // Filter by date range
  if (state.startDate) {
    filtered = filtered.filter(
      (att) => new Date(att.date) >= new Date(state.startDate)
    );
  }

  if (state.endDate) {
    filtered = filtered.filter(
      (att) => new Date(att.date) <= new Date(state.endDate)
    );
  }

  state.filteredAttendances = filtered;
}

export const fetchAttendance = createAsyncThunk(
  "attendance/fetchAttendance",
  async (_, { rejectWithValue }) => {
    try {
      const data = await attendanceService.viewAttendance();
      return data.attendances || [];
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch attendance");
    }
  }
);

const attendanceSlice = createSlice({
  name: "attendance",
  initialState: {
    attendances: [],
    filteredAttendances: [],
    searchQuery: "",
    startDate: "",
    endDate: "",
    loading: false,
    error: null,
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      filterAttendances(state);
    },
    setStartDate: (state, action) => {
      state.startDate = action.payload;
      filterAttendances(state);
    },
    setEndDate: (state, action) => {
      state.endDate = action.payload;
      filterAttendances(state);
    },
    clearFilters: (state) => {
      state.searchQuery = "";
      state.startDate = "";
      state.endDate = "";
      state.filteredAttendances = state.attendances;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.attendances = action.payload;
        state.filteredAttendances = action.payload;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchQuery, setStartDate, setEndDate, clearFilters } =
  attendanceSlice.actions;
export default attendanceSlice.reducer;

