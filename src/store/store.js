import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import departmentReducer from "./slices/departmentSlice";
import designationReducer from "./slices/designationSlice";

/**
 * Root Redux store configuration.
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    departments: departmentReducer,
    designations: designationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;

