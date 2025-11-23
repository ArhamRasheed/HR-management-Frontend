import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { candidateService } from "../../api/candidateService";

/**
 * Helper function to filter candidates
 */
function filterCandidates(state) {
  let filtered = state.candidates;

  // Filter by search query (name or email)
  if (state.searchQuery) {
    const query = state.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (candidate) =>
        candidate.full_name?.toLowerCase().includes(query) ||
        candidate.email?.toLowerCase().includes(query)
    );
  }

  // Filter by department
  if (state.departmentFilter && state.departmentFilter !== "All Departments") {
    filtered = filtered.filter(
      (candidate) => candidate.department === state.departmentFilter
    );
  }

  // Filter by status
  if (state.statusFilter && state.statusFilter !== "All Statuses") {
    filtered = filtered.filter(
      (candidate) =>
        candidate.status?.toLowerCase() === state.statusFilter.toLowerCase()
    );
  }

  state.filteredCandidates = filtered;
}

export const fetchCandidates = createAsyncThunk(
  "candidates/fetchCandidates",
  async (_, { rejectWithValue }) => {
    try {
      const data = await candidateService.getAllCandidates();
      return data.all_candidates || [];
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch candidates");
    }
  }
);

export const updateCandidateStatus = createAsyncThunk(
  "candidates/updateCandidateStatus",
  async ({ candidateId, status }, { rejectWithValue }) => {
    try {
      const data = await candidateService.updateCandidateStatus(
        candidateId,
        status
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to update candidate status"
      );
    }
  }
);

const candidateSlice = createSlice({
  name: "candidates",
  initialState: {
    candidates: [],
    filteredCandidates: [],
    searchQuery: "",
    departmentFilter: "All Departments",
    statusFilter: "All Statuses",
    loading: false,
    error: null,
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      filterCandidates(state);
    },
    setDepartmentFilter: (state, action) => {
      state.departmentFilter = action.payload;
      filterCandidates(state);
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
      filterCandidates(state);
    },
    clearFilters: (state) => {
      state.searchQuery = "";
      state.departmentFilter = "All Departments";
      state.statusFilter = "All Statuses";
      state.filteredCandidates = state.candidates;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCandidates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCandidates.fulfilled, (state, action) => {
        state.loading = false;
        state.candidates = action.payload;
        state.filteredCandidates = action.payload;
      })
      .addCase(fetchCandidates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSearchQuery,
  setDepartmentFilter,
  setStatusFilter,
  clearFilters,
} = candidateSlice.actions;
export default candidateSlice.reducer;

