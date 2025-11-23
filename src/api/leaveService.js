import { request } from "./config";
import { API_ENDPOINTS } from "../constants/apiEndpoints";

export const leaveService = {
  fetchLeaves: () => {
    return request(API_ENDPOINTS.leaves.list(), {
      method: "GET",
      credentials: "include",
    });
  },

  addLeave: (leaveData) => {
    return request(API_ENDPOINTS.leaves.add(), {
      method: "POST",
      credentials: "include",
      body: leaveData,
    });
  },

  fetchEmployeesOnLeave: () => {
    return request(API_ENDPOINTS.leaves.employees(), {
      method: "GET",
      credentials: "include",
    });
  },

  updateLeave: (employeeId, leaveData) => {
    return request(API_ENDPOINTS.leaves.edit(employeeId), {
      method: "PUT",
      credentials: "include",
      body: leaveData,
    });
  },

  applyLeave: (employeeId, leaveData) => {
    return request(API_ENDPOINTS.leaves.apply(employeeId), {
      method: "POST",
      credentials: "include",
      body: leaveData,
    });
  },
};

