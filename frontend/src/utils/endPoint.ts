export const ENDPOINT = {
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  CREATE_STAFF: "/auth/create-staff",
  GET_ALL_STAFF: "/auth/staff",
  DELETE_STAFF: (staffId: string) => `/auth/staff/${staffId}`,
  CHECK_IN: "/attendance/check-in",
  CHECK_OUT: "/attendance/check-out",
  GET_TODAY_ATTENDANCE: "/attendance/today",
  GET_MY_ATTENDANCE: "/attendance/history",

  GET_TODAY_SUMMARY: "/attendance/today/summary",
  GET_TODAY_ALL_ATTENDANCE: "/attendance/today/all",
  UPDATE_STAFF: (staffId: string) => `/auth/staff/${staffId}`,
};
