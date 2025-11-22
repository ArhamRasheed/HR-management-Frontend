import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { employeeService } from "../../api/employeeService";

const initialState = {
  employees: [],
  loading: false,
  error: null,
  searchQuery: "",
  currentPage: 1,
  itemsPerPage: 5,
};

/**
 * Fetch all employees.
 */
export const fetchEmployees = createAsyncThunk(
  "employees/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await employeeService.fetchEmployees();
      return response.employees ?? [];
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const employeeSlice = createSlice({
  name: "employees",
  initialState,
  reducers: {
    /**
     * Update search query.
     */
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.currentPage = 1; // Reset to first page on search
    },

    /**
     * Set current page.
     */
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },

    /**
     * Clear error state.
     */
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.employees = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load employees.";
      });
  },
});

export const { setSearchQuery, setCurrentPage, clearError } = employeeSlice.actions;
export default employeeSlice.reducer;

