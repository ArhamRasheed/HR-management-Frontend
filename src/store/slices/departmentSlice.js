import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { departmentService } from "../../api/departmentService";

const initialState = {
  departments: [],
  loading: false,
  error: null,
  lastActionMessage: null,
};

const normalizeError = (error) =>
  error?.message || error || "Unable to complete the request right now.";

export const fetchDepartments = createAsyncThunk(
  "departments/fetch",
  /**
   * Fetch departments thunk.
   *
   * @param {void} _arg
   * @param {import("@reduxjs/toolkit").ThunkAPI} thunkAPI
   */
  async (_, thunkAPI) => {
    try {
      const response = await departmentService.fetchDepartments();
      return response.departments || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(normalizeError(error));
    }
  }
);

export const addDepartment = createAsyncThunk(
  "departments/add",
  /**
   * Add department thunk.
   *
   * @param {{ name: string }} payload
   * @param {import("@reduxjs/toolkit").ThunkAPI} thunkAPI
   */
  async ({ name }, thunkAPI) => {
    try {
      const response = await departmentService.addDepartment({ name });
      await thunkAPI.dispatch(fetchDepartments());
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(normalizeError(error));
    }
  }
);

export const updateDepartment = createAsyncThunk(
  "departments/update",
  /**
   * Update department thunk.
   *
   * @param {{ id: number|string, name: string }} payload
   * @param {import("@reduxjs/toolkit").ThunkAPI} thunkAPI
   */
  async ({ id, name }, thunkAPI) => {
    try {
      const response = await departmentService.updateDepartment(id, { name });
      await thunkAPI.dispatch(fetchDepartments());
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(normalizeError(error));
    }
  }
);

export const deleteDepartment = createAsyncThunk(
  "departments/delete",
  /**
   * Delete department thunk.
   *
   * @param {{ id: number|string }} payload
   * @param {import("@reduxjs/toolkit").ThunkAPI} thunkAPI
   */
  async ({ id }, thunkAPI) => {
    try {
      const response = await departmentService.deleteDepartment(id);
      await thunkAPI.dispatch(fetchDepartments());
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(normalizeError(error));
    }
  }
);

const departmentSlice = createSlice({
  name: "departments",
  initialState,
  reducers: {
    /**
     * Reset transient UI metadata.
     *
     * @param {typeof initialState} state
     */
    clearDepartmentStatus(state) {
      state.error = null;
      state.lastActionMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = action.payload;
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addDepartment.pending, (state) => {
        state.error = null;
        state.lastActionMessage = null;
      })
      .addCase(addDepartment.fulfilled, (state, action) => {
        state.lastActionMessage = action.payload?.message || "Department created successfully.";
      })
      .addCase(addDepartment.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        state.lastActionMessage = action.payload?.message || "Department updated successfully.";
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.lastActionMessage = action.payload?.message || "Department deleted successfully.";
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearDepartmentStatus } = departmentSlice.actions;

export default departmentSlice.reducer;

