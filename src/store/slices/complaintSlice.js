import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { complaintService } from "../../api/complaintService";

/**
 * Helper function to filter complaints
 */
function filterComplaints(state) {
  let filtered = state.complaints;

  // Filter by search query (ID, employee name, or title)
  if (state.searchQuery) {
    const query = state.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (complaint) =>
        complaint.id?.toString().includes(query) ||
        complaint.employee_name?.toLowerCase().includes(query) ||
        complaint.title?.toLowerCase().includes(query)
    );
  }

  // Filter by status (case-insensitive)
  if (state.statusFilter && state.statusFilter !== "All Complaint") {
    filtered = filtered.filter(
      (complaint) =>
        complaint.status?.toLowerCase() === state.statusFilter.toLowerCase()
    );
  }

  state.filteredComplaints = filtered;
}

export const fetchComplaints = createAsyncThunk(
  "complaints/fetchComplaints",
  async (_, { rejectWithValue }) => {
    try {
      const data = await complaintService.getAllComplaints();
      return data.complaints || [];
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch complaints");
    }
  }
);

export const updateComplaintStatus = createAsyncThunk(
  "complaints/updateComplaintStatus",
  async ({ complaintId, status }, { rejectWithValue }) => {
    try {
      const data = await complaintService.updateComplaintStatus(
        complaintId,
        status
      );
      return data;
    } catch (error) {
      return rejectWithValue(
        error.message || "Failed to update complaint status"
      );
    }
  }
);

export const deleteComplaint = createAsyncThunk(
  "complaints/deleteComplaint",
  async (complaintId, { rejectWithValue }) => {
    try {
      const data = await complaintService.deleteComplaint(complaintId);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to delete complaint");
    }
  }
);

export const addComplaint = createAsyncThunk(
  "complaints/addComplaint",
  async (complaintData, { rejectWithValue }) => {
    try {
      const data = await complaintService.addComplaint(complaintData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to add complaint");
    }
  }
);

const complaintSlice = createSlice({
  name: "complaints",
  initialState: {
    complaints: [],
    filteredComplaints: [],
    searchQuery: "",
    statusFilter: "All Complaint", // Default filter
    loading: false,
    error: null,
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      filterComplaints(state);
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
      filterComplaints(state);
    },
    clearFilters: (state) => {
      state.searchQuery = "";
      state.statusFilter = "All Complaint";
      state.filteredComplaints = state.complaints;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComplaints.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComplaints.fulfilled, (state, action) => {
        state.loading = false;
        state.complaints = action.payload;
        state.filteredComplaints = action.payload;
      })
      .addCase(fetchComplaints.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchQuery, setStatusFilter, clearFilters } =
  complaintSlice.actions;
export default complaintSlice.reducer;

