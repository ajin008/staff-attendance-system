export const ENDPOINT = {
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  CHECK_IN: "/staff/check-in",
  CHECK_OUT: "/attendance/check-out",
  GET_TODAY_ATTENDANCE: "/staff/getTodayAttendance",
  REGISTER: "/auth/register",
  CREATE_DEPARTMENT: "/admin/createDepartment",
  GET_ALL_DEPARTMENTS: "admin/fetchDepartment",
  CREATE_STAFF: "/admin/create-staff",
  DASHBOARD_STATS: "/admin/dashboard/stats",
  //staff service
  GET_ALL_STAFF: "/admin/getAllStaff",
  GET_STAFF_BY_ID: (staffId: string) => `/admin/getStaff/${staffId}`,
  DELETE_STAFF: (staffId: string) => `/admin/deleteStaff/${staffId}`,
  UPDATE_STAFF: (staffId: string) => `/admin/updateStaff/${staffId}`,
  // department
  GET_DEPARTMENT_BY_ID: (departmentId: number) =>
    `/admin/getDepartment/${departmentId}`,
  DELETE_DEPARTMENT: (departmentId: number) =>
    `/admin/deleteDepartment/${departmentId}`,
  UPDATE_DEPARTMENT: (departmentId: number) =>
    `/admin/updateDepartment/${departmentId}`,

  // branch
  GET_ALL_BRANCHES: "/admin/branches",
};
