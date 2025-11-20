import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { designationService } from "../../api/designationService";

const initialState = {
  designations: [],
  loading: false,
  error: null,
  lastActionMessage: null,
};

const normalizeError = (error) =>
  error?.message || error || "Unable to complete the request right now.";

export const fetchDesignations = createAsyncThunk(
  "designations/fetch",
  /**
   * Fetch designations thunk.
   *
   * @param {void} _arg
   * @param {import("@reduxjs/toolkit").ThunkAPI} thunkAPI
   */
  async (_, thunkAPI) => {
    try {
      const response = await designationService.fetchDesignations();
      return response.designations || [];
    } catch (error) {
      return thunkAPI.rejectWithValue(normalizeError(error));
    }
  }
);

export const addDesignation = createAsyncThunk(
  "designations/add",
  /**
   * Add designation thunk.
   *
   * @param {{ name: string }} payload
   * @param {import("@reduxjs/toolkit").ThunkAPI} thunkAPI
   */
  async ({ name }, thunkAPI) => {
    try {
      const response = await designationService.addDesignation({ name });
      await thunkAPI.dispatch(fetchDesignations());
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(normalizeError(error));
    }
  }
);

export const updateDesignation = createAsyncThunk(
  "designations/update",
  /**
   * Update designation thunk.
   *
   * @param {{ id: number|string, name: string }} payload
   * @param {import("@reduxjs/toolkit").ThunkAPI} thunkAPI
   */
  async ({ id, name }, thunkAPI) => {
    try {
      const response = await designationService.updateDesignation(id, { name });
      await thunkAPI.dispatch(fetchDesignations());
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(normalizeError(error));
    }
  }
);

export const deleteDesignation = createAsyncThunk(
  "designations/delete",
  /**
   * Delete designation thunk.
   *
   * @param {{ id: number|string }} payload
   * @param {import("@reduxjs/toolkit").ThunkAPI} thunkAPI
   */
  async ({ id }, thunkAPI) => {
    try {
      const response = await designationService.deleteDesignation(id);
      await thunkAPI.dispatch(fetchDesignations());
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(normalizeError(error));
    }
  }
);

const designationSlice = createSlice({
  name: "designations",
  initialState,
  reducers: {
    /**
     * Clear transient UI flags.
     *
     * @param {typeof initialState} state
     */
    clearDesignationStatus(state) {
      state.error = null;
      state.lastActionMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDesignations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDesignations.fulfilled, (state, action) => {
        state.loading = false;
        state.designations = action.payload;
      })
      .addCase(fetchDesignations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addDesignation.pending, (state) => {
        state.error = null;
        state.lastActionMessage = null;
      })
      .addCase(addDesignation.fulfilled, (state, action) => {
        state.lastActionMessage = action.payload?.message || "Designation created successfully.";
      })
      .addCase(addDesignation.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateDesignation.fulfilled, (state, action) => {
        state.lastActionMessage = action.payload?.message || "Designation updated successfully.";
      })
      .addCase(updateDesignation.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteDesignation.fulfilled, (state, action) => {
        state.lastActionMessage = action.payload?.message || "Designation removed successfully.";
      })
      .addCase(deleteDesignation.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearDesignationStatus } = designationSlice.actions;

export default designationSlice.reducer;

