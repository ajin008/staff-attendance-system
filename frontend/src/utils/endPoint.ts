export const ENDPOINT = {
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  CHECK_IN: "/staff/check-in",
  CHECK_OUT: "/staff/check-out",
  GET_TODAY_ATTENDANCE: "/staff/attendance/today",
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
  TOGGLE_DEPARTMENT: (departmentId: number) =>
    `/admin/toggleDepartmentStatus/${departmentId}`,
  // branch
  GET_ALL_BRANCHES: "/admin/branches",
  GET_TODAY_ATTENDANCE_DATA: "/admin/attendance/today",

  // Floor endpoints
  GET_ALL_FLOORS: "/admin/getAllFloors",
  CREATE_FLOOR: "/admin/createFloors",
  UPDATE_FLOOR: (id: number) => `/admin/floors/${id}`,
  DELETE_FLOOR: (id: number) => `/admin/floors/${id}`,

  GET_AVAILABLE_STAFF: (floorId: number) =>
    `/admin/floors/${floorId}/available-staff`,
  GET_FLOOR_STAFF: (floorId: number) => `/admin/floors/${floorId}/staff`,
  ASSIGN_STAFF_TO_FLOOR: (floorId: number) => `/admin/floors/${floorId}/assign`,
  REMOVE_STAFF_FROM_FLOOR: (floorId: number, staffId: number) =>
    `/admin/floors/${floorId}/staff/${staffId}`,

  // staff leave endpoints
  CREATE_LEAVE: "/staff/leaves/create",
  GET_MY_LEAVES: "/staff/leaves/my-leaves",
  GET_ALL_LEAVES: "/admin/all-leaves",
  UPDATE_LEAVE_STATUS: (leaveId: number) => `/admin/leaves/${leaveId}/status`,
  GET_STAFF_ATTENDANCE: (staffId: string) =>
    `/admin/staff/${staffId}/attendance`,

  // Payroll endpoints
  GET_PAYROLL: "/admin/payroll",
  GENERATE_PAYSLIP: "/admin/payroll/generate-payslip",

  // profile endpoints
  GET_PROFILE: "/admin/profile-settings/get-profile",
  UPDATE_PROFILE: "/admin/profile-settings/update-profile",
  ADD_BRANCH: "/admin/create-branch",
  UPDATE_BRANCH: (branchId: number) => `/admin/branches/${branchId}`,

  // profile staff
  GET_MY_PROFILE: "/staff/profile",
  GET_MY_ATTENDANCE: "/staff/attendance/history",
};
