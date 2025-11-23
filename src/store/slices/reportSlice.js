import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { reportService } from "../../api/reportService";

export const fetchReports = createAsyncThunk(
  "reports/fetchReports",
  async ({ docType, month, year }, { rejectWithValue }) => {
    try {
      const response = await reportService.fetchReports(docType, month, year);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch reports");
    }
  }
);

const reportSlice = createSlice({
  name: "reports",
  initialState: {
    reports: [],
    loading: false,
    error: null,
    filters: {
      searchQuery: "",
      docType: "All Types",
      month: null,
      year: null,
    },
    currentPage: 1,
    itemsPerPage: 10,
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.filters.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setDocType: (state, action) => {
      state.filters.docType = action.payload;
      state.currentPage = 1;
    },
    setPeriod: (state, action) => {
      state.filters.month = action.payload.month;
      state.filters.year = action.payload.year;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.loading = false;
        // Combine company and employee reports
        const companyReports = (action.payload.company_reports || []).map((r) => ({
          ...r,
          type: "Company",
        }));
        const employeeReports = (action.payload.employee_reports || []).map((r) => ({
          ...r,
          type: "Employee",
        }));
        state.reports = [...companyReports, ...employeeReports];
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSearchQuery, setDocType, setPeriod, setCurrentPage } =
  reportSlice.actions;
export default reportSlice.reducer;

