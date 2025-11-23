import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import departmentReducer from "./slices/departmentSlice";
import designationReducer from "./slices/designationSlice";
import dashboardReducer from "./slices/dashboardSlice";
import employeeReducer from "./slices/employeeSlice";
import attendanceReducer from "./slices/attendanceSlice";
import complaintReducer from "./slices/complaintSlice";
import candidateReducer from "./slices/candidateSlice";
import reportReducer from "./slices/reportSlice";

/**
 * Root Redux store configuration.
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
    departments: departmentReducer,
    designations: designationReducer,
    dashboard: dashboardReducer,
    employees: employeeReducer,
    attendance: attendanceReducer,
    complaints: complaintReducer,
    candidates: candidateReducer,
    reports: reportReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
